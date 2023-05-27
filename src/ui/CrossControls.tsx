import React, { DependencyList, EffectCallback } from "react";
import VoiceList from "./VoiceList";
import { Voice, VoiceIndex, Utterance, Cross } from "../Model";
import CrossAudio from "../CrossAudio";
import "./CrossControls.css";
const reactTo = (deps: DependencyList, effect: EffectCallback) => {
  React.useEffect(effect, deps);
};

export default ({
  voices,
  cross,
  preventUtteranceOverlap,
}: {
  voices: VoiceIndex;
  cross: Cross;
  preventUtteranceOverlap: boolean;
}) => {
  const [activeVoice, setActiveVoice] = React.useState<Voice | undefined>(
    undefined
  );

  const [activePhrase, setActivePhrase] = React.useState<string | undefined>(
    undefined
  );

  reactTo([cross, voices], () => {
    setActiveVoice(undefined);
    let voiceNames = cross.voices;
    if (cross.voices.length === 0) {
      return;
    }
    if (!(voiceNames[0] in voices)) {
      return;
    }
    setActiveVoice(voices[voiceNames[0]]);
  });

  return (
    <>
      <table
        style={{ fontSize: "0.7rem" }}
        className="table table-sm table-bordered"
      >
        <thead>
          <tr>
            <th>&times;</th>
            {cross.phrases.map((p) => (
              <th
                className="rotate"
                onClick={async () => {
                  if (activePhrase !== undefined) {
                    await CrossAudio.stopAllForPhrase(cross, activePhrase);
                    setActivePhrase(undefined);
                  }
                  if (activeVoice !== undefined) {
                    await CrossAudio.stopAllForVoice(cross, activeVoice.name);
                    setActiveVoice(undefined);
                  }
                  setActivePhrase(p);
                  await CrossAudio.playAllVoicesFor(cross, p, (v) => {
                    setActivePhrase(p);
                    setActiveVoice(undefined);
                  });
                }}
              >
                <div>
                  <span>{p}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cross.voices.map((v) => (
            <tr>
              <th
                onClick={async () => {
                  if (activePhrase !== undefined) {
                    await CrossAudio.stopAllForPhrase(cross, activePhrase);
                    setActivePhrase(undefined);
                  }
                  if (activeVoice !== undefined) {
                    await CrossAudio.stopAllForVoice(cross, activeVoice.name);
                    setActiveVoice(undefined);
                  }
                  setActiveVoice(voices[v]);
                  await CrossAudio.playAllPhrasesFor(cross, v, (p) => {
                    setActivePhrase(undefined);
                    setActiveVoice(voices[v]);
                  });
                }}
              >
                {v}
              </th>
              {cross.phrases.map((p) => {
                let active = activeVoice === voices[v] && activePhrase === p;
                let highlighted =
                  activePhrase === p || activeVoice === voices[v];
                return (
                  <td
                    className={
                      "p-0" +
                      (active
                        ? " table-danger"
                        : highlighted
                        ? " table-primary"
                        : "")
                    }
                  >
                    <div className="d-grid" style={{ position: "relative" }}>
                      <button
                        style={{
                          border: "none",
                          borderRadius: 0,
                        }}
                        className={
                          "btn btn-sm btn-outline-primary" +
                          (active ? " active" : "")
                        }
                        onClick={async () => {
                          if (activePhrase !== undefined) {
                            await CrossAudio.stopAllForPhrase(
                              cross,
                              activePhrase
                            );
                            setActivePhrase(undefined);
                          }
                          if (activeVoice !== undefined) {
                            await CrossAudio.stopAllForVoice(
                              cross,
                              activeVoice.name
                            );
                            setActiveVoice(undefined);
                          }
                          setActivePhrase(p);
                          setActiveVoice(voices[v]);
                          await CrossAudio.playUtterance({
                            voice: v,
                            label: p,
                          });
                        }}
                      >
                        <img
                          src="/icons/play.svg"
                          style={{
                            height: "0.7em",
                            filter: `invert(${highlighted ? 0 : 1})`,
                          }}
                        />
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <VoiceList
          voices={Object.fromEntries(cross.voices.map((v) => [v, voices[v]]))}
          selected={activeVoice}
          setSelected={(s: Voice | undefined) => setActiveVoice(s)}
        />
      </div>
      {!!activeVoice && (
        <div style={{ marginTop: "1em" }}>
          <div style={{ marginTop: "1em" }} className="d-flex flex-wrap">
            {cross.phrases.map((phrase) => (
              <button
                className={
                  "btn btn-lg btn-outline-primary" +
                  (activePhrase === phrase ? " active" : "")
                }
                style={{
                  display: "block",
                  width: "48%",
                  margin: "1%",
                }}
                onClick={() => {
                  if (
                    preventUtteranceOverlap &&
                    !!activeVoice &&
                    !!activePhrase
                  ) {
                    CrossAudio.stopUtterance({
                      label: activePhrase,
                      voice: activeVoice.name,
                    });
                  }
                  setActivePhrase(phrase);
                  CrossAudio.playUtterance({
                    voice: activeVoice.name,
                    label: phrase,
                  });
                }}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
