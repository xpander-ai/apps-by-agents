async function _aampliAmplitudeSdkInitializer() {
  const amplitudeContextPlugin = {
    execute: async (e) => {
      e.library = "amplitude-ts-wordpress/0.2.2";
      return e;
    },
  };

  if (aampliPlgScrPayload.shouldChangeLibrary === "1") {
    window.amplitude.add(amplitudeContextPlugin);
  }

  const amplitudeConfigOptions = {
    autocapture: { elementInteractions: true },
    logLevel: window.amplitude.Types.LogLevel.None,
    ...(aampliPlgScrPayload.isEuServerZone === "1" && { serverZone: "EU" }),
  };

  if (aampliPlgScrPayload.sessionReplay === "1") {
    const aampliPlgRawSampleRate = parseFloat(
      aampliPlgScrPayload?.sampleRate ?? 0
    );
    const aampliPlgProcessedSampleRate = !isNaN(aampliPlgRawSampleRate)
      ? aampliPlgRawSampleRate / 100.0
      : 0.0;
    const aampliPlgSdkSampleRate =
      aampliPlgProcessedSampleRate >= 0.0 && aampliPlgProcessedSampleRate <= 1.0
        ? aampliPlgProcessedSampleRate
        : 0.0;

    await window.amplitude.add(
      window.sessionReplay.plugin({ sampleRate: aampliPlgSdkSampleRate })
    ).promise;
  }
  window.amplitude.init(aampliPlgScrPayload.apiKey, amplitudeConfigOptions);
}

_aampliAmplitudeSdkInitializer();
