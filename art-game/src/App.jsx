import React, { useState, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';
import Prose from './prose/Prose';
import { ArrowLeft, ArrowRight, ArrowUp, HandWaving, Warning } from 'phosphor-react';

const roles = {
    collector: {
        name: "Collector",
        description: "Submit art for sale, view the gallery and participate in the auction.",
        permissions: {
            view: true,
            bid: true,
            auction: true,
            art: true,
        },
    },
    connoisseur: {
        name: "Connoisseur",
        description: "Form a panel with other art connoisseurs where you may judge the gallery art for authenticity and spectate the auction.",
        permissions: {
            view: true,
            bid: false,
            auction: false,
            art: true,
            judge: true,
        },
    },
    artist: {
        name: "Artist",
        description: "Submit art for sale and spectate the auction.",
        permissions: {
            view: true,
            bid: false,
            auction: false,
            art: true,
        },
    },
    guest: {
        name: "Guest",
        description: "View the gallery and spectate the auction.",
        permissions: {
            view: true,
            bid: false,
            auction: false,
            art: false,
        },
    },
}


const gameMachine = createMachine({
    predictableActionArguments: true,
    id: 'game',
    initial: 'lobby',
    context: {
        people: [],
        participants: [],
        art: [],
    },
    states: {
        lobby: {
            on: { NEXT: 'creator' },
        },
        creator: {
            on: {
                BACK: 'lobby',
                NEXT: {
                    target: 'participants',
                    cond: (context) => {
                        return context.participants.filter((participant) => participant.role === "collector").length > 0
                    }
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

        participants: {
            entry: [
                (context) => {
                    const players_min = 4;
                    const participants = [...context.participants];
                    const players = context.participants.filter((participant) => participant.role === "collector").length;
                    const players_missing = players_min - players;
                    if (players_missing) {
                        for (let i = 0; i < players_missing; i++) {
                            participants.push({
                                id: participants.length,
                                name: `Clever AI ${participants.length + 1}`,
                                role: 'collector',
                                type: 'ai',
                            });
                        }
                    }
                    return context.participants = participants;
                }
            ],
            on: {
                BACK: 'lobby',
                NEXT: {
                    target: 'art',
                    cond: (context) => {
                        return context.participants.filter((participant) => participant.role === "collector").length > 0
                    },
                    actions: [
                        assign({
                            participants: (context) => {
                                const players_min = 4;
                                const participants = [...context.participants];
                                const players = context.participants.filter((participant) => participant.role === "collector").length;
                                const players_missing = players_min - players;
                                if (players_missing) {
                                    for (let i = 0; i < players_missing; i++) {
                                        participants.push({
                                            id: participants.length,
                                            name: `Clever AI ${participants.length + 1}`,
                                            role: 'collector',
                                        });
                                    }
                                }
                                return participants;
                            }
                        })
                    ],
                },
            },
        },
        art: {
            on: {
                BACK: 'participants',
                // on invocation
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
                <input type="text" name="name" placeholder='Name' />
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
                    <h4>What are your 4 best traits?</h4>
                    <div className="chip-list">
                        <div className="chip">Charismatic</div>
                        <div className="chip">Crafty</div>
                        <div className="chip">Intelligent</div>
                        <div className="chip">Funny</div>
                    </div>
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
    const [state, stateUpdate] = useMachine(gameMachine);
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