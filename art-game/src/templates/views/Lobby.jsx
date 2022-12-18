import React from "react";
import { Participants } from "./Participants";
import { Art } from "./Art";
import { CharacterCreator } from "./CharacterCreator";
import { ArrowLeft, UserPlus } from "phosphor-react";
import roles from "../../data/roles";

export function Lobby({ state, stateUpdate }) {
    return (
        <div>   
            <Participants participants={state.context.participants} roles={roles} />
            <Art state={state} stateUpdate={stateUpdate} />
            <CharacterCreator state={state} stateUpdate={stateUpdate} />
            <button onClick={() => stateUpdate("BACK")}>
                    <div>Cancel</div>
                    <ArrowLeft size={32}/>
            </button>
            <button onClick={() => stateUpdate("NEXT")}>
                    <div>Next</div>
                    <UserPlus size={32} />
            </button>
        </div>
    );
}