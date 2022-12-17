import React, { useState, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import stateMachine from './state/machine';
import Prose from './prose/Prose';
import { ArrowLeft, ArrowRight, ArrowUp, HandWaving, Warning } from 'phosphor-react';
import roles from './data/roles';


export function Lobby({ state, stateUpdate }) {
    return (
        <div>
            <Prose.Welcome />
        </div>
    );
}

export function CharacterCreator({ state, stateUpdate }) {
    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = [];
        if (event.target.elements.name.value === "") {
            errors.push("Name is required");
        }
        if (event.target.elements.role.value === "") {
            errors.push("Role is required");
        }
        if (errors.length) {
            return alert(
                `Please correct the following errors:\n${errors.join("\n")}`
            );
        }
        event.target.reportValidity();
        const { name, role } = event.target.elements;
        stateUpdate({
            type: "ADD",
            name: name.value,
            role: role.value,
        });
        stateUpdate({ type: "NEXT" });
    };
    return (
        <>
            <form onSubmit={handleSubmit} onError={(error) => console.log(error)}>
                <div className='form-container'>
                    <h3>Name</h3>
                    <input type="text" name="name" placeholder='Name' />
                </div>
                <div className='role-container'>
                    <h3>Role</h3>
                    <div className="role-list">
                        <div className="table-row header">
                            <div></div>
                            <div>Role</div>
                            <div>Description</div>
                        </div>
                        {Object.entries(roles).map(([key, role], index) => (
                            <div key={key} className="table-row role">
                                <input type="radio" name="role" value={key} />
                                <label htmlFor={role}>{role.name}</label>
                                <div className="description">{role.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='persona-container'>
                    <h3>Persona</h3>
                    <h4>Coming soon!</h4>
                    {/* <h4>What are your 4 best traits?</h4>
                    <input type="text" name="persona" placeholder='Trait' />
                    <div className="chip-list">
                        <div className="chip">Charismatic</div>
                        <div className="chip">Crafty</div>
                        <div className="chip">Intelligent</div>
                        <div className="chip">Funny</div>
                    </div> */}
                </div>
                <button type="submit">Confirm</button>
            </form>
        </>
    );
}
export function Participants({ state, stateUpdate }) {
    const collectors = state.context.participants.filter((participant) => participant.role === "collector").length;
    return (
        <div>
            {/* <div className="participants">
                {state.context.participants.map((participant, index) => (
                    <div key={index}>
                        <div>{participant.name}</div>
                        <div>{participant.role}</div>
                    </div>
                ))}
            </div> */}
            <h2>Participants ({state.context.participants.length})</h2>
            <div className="participants-role-container">
                <div className="participants-role required">
                    <h3>Collectors</h3>
                    <div>{roles.collector.description}</div>
                    {collectors < 4 && (
                        <div className='alert alert--inline'>
                            {/* <Warning size={32} />    */}
                            <HandWaving size={64} />
                            <div>A minimum of four collectors is required to play. If the number of player collectors is less than four, the remainder will be played by AI.</div>
                        </div>
                    )}
                    <ol>
                        {state.context.participants.filter((participant) => participant.role === "collector").map((participant, index) => (
                            <li key={index}>{participant.name}</li>
                        ))}
                    </ol>
                </div>
                <div className="participants-role">
                    <h3>Guests</h3>
                    <div>{roles.guest.description}</div>
                    <ul>
                        {state.context.participants.filter((participant) => participant.role === "guest").map((participant, index) => (
                            <li key={index}>{participant.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="participants-role">
                    <h3>Artists</h3>
                    <div>{roles.artist.description}</div>
                    <ul>
                        {state.context.participants.filter((participant) => participant.role === "artist").map((participant, index) => (
                            <li key={index}>{participant.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="participants-role">
                    <h3>Connoisseurs</h3>
                    <div>{roles.connoisseur.description}</div>
                    <ul>
                        {state.context.participants.filter((participant) => participant.role === "connoisseur").map((participant, index) => (
                            <li key={index}>{participant.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function Art({ state, stateUpdate }) {
    return (
        <div>
            <h2>Art</h2>
        </div>
    );
}

export function Breadcrumbs({ state }) {
    return (
        <div className="breadcrumbs">
            {state.machine.states ? Object.keys(state.machine.states).map((thisState, index) => (
                <div key={index} className={`breadcrumb${state.matches(thisState) ? " active" : ""}`}>{thisState}</div>
            )) : null}
        </div>
    )
}

export function App() {
    const [state, stateUpdate] = useMachine(stateMachine);
    const lobby = state.matches("lobby");
    const creator = state.matches("creator");
    const participants = state.matches("participants");
    const art = state.matches("art");
    return (
        <>
            <h1>🎨 The Fine Art Gallery and Auction House</h1>
            <div className='header'>
                <div className='stages'>
                    <button onClick={() => stateUpdate("BACK")}>
                        <ArrowLeft size={32} />
                    </button>
                    <Breadcrumbs state={state} />
                    <button onClick={() => stateUpdate("NEXT")}>
                        <ArrowRight size={32} />
                    </button>
                </div>
            </div>
            {lobby ? <Lobby state={state} stateUpdate={stateUpdate} /> : null}
            {creator && <CharacterCreator state={state} stateUpdate={stateUpdate} />}
            {participants ? <Participants state={state} stateUpdate={stateUpdate} /> : null}
            {art ? <Art state={state} stateUpdate={stateUpdate} /> : null}
        </>
    );
}