import { ArrowRight } from 'phosphor-react';
import React from 'react';
import Prose from '../../prose/Prose'

export function Home({ state, stateUpdate }) {
    return (
        <div className="letter">
            <Prose.Welcome />
            <button onClick={() => stateUpdate("NEXT")}>
                <div>Enter Lobby</div>
                <ArrowRight size={32} />
            </button>
        </div>
    );
}