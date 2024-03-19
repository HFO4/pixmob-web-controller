import { register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

await register(await connect());

const sampleRate = 44100;
const mutiply = 3;

const getAudioWorkletBlob = (inst: number[]) => {
  const data = inst;
  // repeat data for mutiply
  for (let i = 0; i < mutiply; i++) {
    inst = inst.concat([0, 0, 0, ...data]);
  }
  const blob = new Blob(
    [
      `
class MyProcessor extends AudioWorkletProcessor {
  data = ${JSON.stringify(inst)};
  sampleRate = 44100;
  cfreq = 36000; // The infrared carrier frequency
  pperunit = 30; //The carrier frequency period per time unit, 694.44*(36000/1000000)     // Total length of a code (in time units)
  totalSamples = Math.round(
    this.sampleRate * (1 / this.cfreq) * this.pperunit * this.data.length,
  );
  previousSampledIndex = 0;

  process(_, outputs) {
    const output = outputs[0];
    for (let channel = 0; channel < output.length; ++channel) {
      let sampledIndex = this.previousSampledIndex;
      for (let i = 0; i < output[channel].length; i += 1) {
        if (sampledIndex <= this.totalSamples) {
          const dataIndex = Math.floor(
            ((sampledIndex / this.sampleRate) * this.cfreq) / this.pperunit,
          );
          console.log(dataIndex);
          if (this.data[dataIndex] !== 0) {
            output[channel][i] = Math.sin(
              (sampledIndex / this.totalSamples) *
                Math.PI *
                this.cfreq *
                (this.totalSamples / this.sampleRate),
            );
          } else {
            output[channel][i] = 0;
          }
        }
        sampledIndex++;
      }
      if (channel === output.length - 1) {
        this.previousSampledIndex = sampledIndex;
      }
    }

    return true;
  }
}

registerProcessor("ir-processor", MyProcessor);


    `,
    ],
    { type: "application/javascript" },
  );
  return URL.createObjectURL(blob);
};

export async function PlayInstruction(inst: number[]) {
  const audioContext = new AudioContext({ sampleRate });
  await audioContext.audioWorklet.addModule(getAudioWorkletBlob(inst));
  const irGenerator = new AudioWorkletNode(audioContext, "ir-processor");
  irGenerator.connect(audioContext.destination);

  const dest = audioContext.createMediaStreamDestination();

  // Uncomment if you want to save to WAV
  // const mediaRecorder = new MediaRecorder(dest.stream, {
  //   mimeType: "audio/wav",
  // });
  // irGenerator.connect(dest);
  // const chunks: Blob[] = [];
  // mediaRecorder.ondataavailable = (evt) => {
  //   // Push each chunk (blobs) in an array
  //   chunks.push(evt.data);
  // };
  // mediaRecorder.onstop = (evt) => {
  //   // Make blob out of our blobs, and open it.
  //   const blob = new Blob(chunks, { type: "audio/wav" });
  //   document.querySelector("audio").src = URL.createObjectURL(blob);
  // };

  // mediaRecorder.start();
  await audioContext.resume();
  await new Promise((r) => setTimeout(r, 1000));
  await audioContext.close();
  // mediaRecorder.stop();
}
