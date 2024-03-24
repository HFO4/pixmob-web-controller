//import { register } from "extendable-media-recorder";

// await register(await connect());

const sampleRate = 44100;
const mutiply = 0;

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
  cfreq = 38000; // The infrared carrier frequency
  cfreqHalf = 19000; // The infrared carrier frequency
  pperunit = 26; //The carrier frequency period per time unit, 694.44*(36000/1000000)     // Total length of a code (in time units)
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
          if (this.data[dataIndex] !== 0) {
            // sin( float(i) * M_PI * float(19000) / float(sampleRate) );
            output[channel][i] = Math.sin(
                sampledIndex * Math.PI * this.cfreqHalf / this.sampleRate,
            ) * (channel === 0 ? 1 : -1);
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

export async function PlayInstruction(
  inst: number[],
  bpm?: string,
  duration?: string,
) {
  const audioContext = new AudioContext({ sampleRate });
  await audioContext.audioWorklet.addModule(getAudioWorkletBlob(inst));
  const irGenerator = new AudioWorkletNode(audioContext, "ir-processor", {
    outputChannelCount: [2],
  });
  irGenerator.connect(audioContext.destination);

  // const dest = audioContext.createMediaStreamDestination();

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

  //mediaRecorder.start();

  await audioContext.resume();
  if (bpm && duration) {
    const bpmInt = parseInt(bpm);
    const durationSec = parseInt(duration);
    const loopCount = Math.ceil(durationSec / (60 / bpmInt));
    for (let i = 0; i < loopCount; i++) {
      const t0 = performance.now();
      await new Promise((r) => setTimeout(r, 500));
      const d = performance.now() - t0;
      console.log(Math.max(60000 / bpmInt - d, 1));
      await new Promise((r) => setTimeout(r, Math.max(60000 / bpmInt - d, 1)));
      new AudioWorkletNode(audioContext, "ir-processor", {
        outputChannelCount: [2],
      }).connect(audioContext.destination);
    }
  } else {
    await new Promise((r) => setTimeout(r, 500));
  }

  await audioContext.close();
  //mediaRecorder.stop();
}
