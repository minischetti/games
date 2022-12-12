import React, { useState, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';
import Prose from './prose/Prose';

const gameMachine = createMachine({
    predictableActionArguments: true,
    id: 'game',
    initial: 'lobby',
    context: {
        players: [],
        art: [],
    },
    states: {
        lobby: {
            on: { NEXT: 'players' },
        },
        players: {
            on: {
                BACK: 'lobby',
                NEXT: {
                    target: 'art',
                    cond: (context) => context.players.length > 1,
                },
                ADD: {
                    actions: assign({
                        players: (context, event) => {
                            const players = [...context.players];
                            players.push({
                                id: players.length,
                                name: `Player ${players.length + 1}`,
                            });
                            return players;
                        }
                    })
                },
            },
        },
        art: {
            on: {
                BACK: 'players',
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

export function Players({ state, stateUpdate }) {
    return (
        <div>
            <button onClick={() => stateUpdate("BACK")}>Back</button>
            <h2>Players</h2>
            <ul>
                {state.context.players.length ? state.context.players.map((player) => (
                    <li key={player.id}>{player.name}</li>
                )) : null}
            </ul>
            <button onClick={() => stateUpdate("ADD")}>Add Player</button>
        </div>
    );
}

export function App() {
    const [state, stateUpdate] = useMachine(gameMachine);
    const lobby = state.matches("lobby");
    const players = state.matches("players");
    const art = state.matches("art");
    return (
        <>
            {lobby ? <Lobby state={state} stateUpdate={stateUpdate} /> : null}
            {players ? <Players state={state} stateUpdate={stateUpdate} /> : null}
            {/* {art ? <Art state={state} stateUpdate={stateUpdate} /> : null} */}
        </>
    );
}