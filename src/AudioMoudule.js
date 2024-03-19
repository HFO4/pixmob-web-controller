class MyProcessor extends AudioWorkletProcessor {
  data = [
    1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1,
  ];
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
