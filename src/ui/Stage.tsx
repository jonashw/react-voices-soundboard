import React from "react";
import { UtteranceMoment, Character } from "../Model";

export default ({
  focusOnSpeakers,
  activeUtteranceMoment,
  characters,
}: {
  focusOnSpeakers: boolean;
  activeUtteranceMoment: UtteranceMoment | undefined;
  characters: { [v: string]: Character };
}) => {
  let characterIds = Object.keys(characters);

  if (focusOnSpeakers && activeUtteranceMoment !== undefined) {
    return (
      <div>
        <div className="d-flex justify-content-evenly">
          {Object.keys(activeUtteranceMoment.utteranceByCharacter).map((c) => (
            <div>
              <div className="me-2">
                <div className="h1">{characters[c].emoji || "👤"}</div>
                {characters[c].name}
              </div>
              {activeUtteranceMoment !== undefined &&
                c in activeUtteranceMoment.utteranceByCharacter && (
                  <div className="alert alert-primary mt-3">
                    {activeUtteranceMoment.utteranceByCharacter[c].label}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="d-flex justify-content-evenly">
        {Object.entries(characters).map(([c, character]) => (
          <div
            style={{
              width: `${Math.floor(100 / characterIds.length)}%`,
            }}
            key={c}
          >
            <div>
              <div className="me-2">
                <div className="h1">{character.emoji || "👤"}</div>
                {character.name}
              </div>
              {activeUtteranceMoment !== undefined &&
                c in activeUtteranceMoment.utteranceByCharacter && (
                  <div className="alert alert-primary mt-3">
                    {activeUtteranceMoment.utteranceByCharacter[c].label}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
