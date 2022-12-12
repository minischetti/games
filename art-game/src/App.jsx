import React, { useState, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';
import Prose from './prose/Prose';

const gameMachine = createMachine({
    predictableActionArguments: true,
    id: 'game',
    initial: 'lobby',
    context: {
        participants: [],
        art: [],
    },
    states: {
        lobby: {
            on: { NEXT: 'participants' },
        },
        participants: {
            on: {
                BACK: 'lobby',
                NEXT: {
                    target: 'art',
                    cond: (context) => context.participants.length >= 1,
                },
                ADD: {
                    actions: assign({
                        participants: (context, event) => {
                            console.log(event);
                            const participants = [...context.participants];
                            participants.push({
                                id: participants.length,
                                name: event.name,
                                role: event.role,
                            });
                            return participants;
                        }
                    })
                },
            },
        },
        art: {
            on: {
                BACK: 'participants',
                NEXT: {
                    target: 'game',
                    cond: (context) => context.art.length > 1,
                },
            },
        },
        game: {
            on: {
                BACK: 'art',
                MOVE: {
                    target: 'game',
                    actions: [
                        'game.move',
                    ],
                },
                NEXT: 'summary',
            },
        },
        summary: {
            on: { RESTART: 'lobby' },
        },
    }
});

export function Lobby({ state, stateUpdate }) {
    return (
        <div>
            <Prose.Welcome />
            <button onClick={() => stateUpdate("NEXT")}>Next (Invite Players)</button>
        </div>
    );
}

export function Participants({ state, stateUpdate }) {
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
    };
    return (
        <div>
            <button onClick={() => stateUpdate("BACK")}>Back</button>
            <h2>Participants</h2>
            <h3>Guests</h3>
            <ul>
                {state.context.participants.filter((participant) => participant.role === "guest").map((participant, index) => (
                    <li key={index}>{participant.name}</li>
                ))}
            </ul>
            <h3>Artists</h3>
            <ul>
                {state.context.participants.filter((participant) => participant.role === "artist").map((participant, index) => (
                    <li key={index}>{participant.name}</li>
                ))}
            </ul>
            <h3>Connoisseurs</h3>
            <ul>
                {state.context.participants.filter((participant) => participant.role === "connoisseur").map((participant, index) => (
                    <li key={index}>{participant.name}</li>
                ))}
            </ul>
            <h3>Collectors</h3>
            <ul>
                {state.context.participants.filter((participant) => participant.role === "collector").map((participant, index) => (
                    <li key={index}>{participant.name}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} onError={(error) => console.log(error)}>
                <input type="text" name="name" placeholder='Name' />
                <select name="role">
                    <option value="">Role</option>
                    <option value="guest">Guest</option>
                    <option value="artist">Artist</option>
                    <option value="connoisseur">Connoisseur</option>
                    <option value="collector">Collector</option>
                </select>
                {/* input type text placeholder role */}
                <button type="submit">Add Participant</button>
            </form>
            <button onClick={() => stateUpdate("NEXT")}>Next</button>
        </div>
    );
}

export function Art({ state, stateUpdate }) {
    return (
        <div>
            <button onClick={() => stateUpdate("BACK")}>Back</button>
            <h2>Art</h2>
            <button onClick={() => stateUpdate("NEXT")}>Next</button>
        </div>
    );
}

export function App() {
    const [state, stateUpdate] = useMachine(gameMachine);
    const lobby = state.matches("lobby");
    const participants = state.matches("participants");
    const art = state.matches("art");
    return (
        <>
            {lobby ? <Lobby state={state} stateUpdate={stateUpdate} /> : null}
            {participants ? <Participants state={state} stateUpdate={stateUpdate} /> : null}
            {art ? <Art state={state} stateUpdate={stateUpdate} /> : null}
        </>
    );
}