import React from 'react';
import { useMachine } from '@xstate/react';
import stateMachine from './state/machine';
import { Breadcrumbs } from './templates/components/Breadcrumbs';
import { Lobby } from './templates/views/Lobby';
import { Game } from './templates/views/Game';
import { Home } from './templates/views/Home';

export function App() {
    const [state, stateUpdate] = useMachine(stateMachine);
    const welcome = state.matches("welcome");
    const lobby = state.matches("lobby");
    const pre_game = state.matches("pre_game");
    const game = state.matches("game");
    const post_game = state.matches("post_game");
    const pages = Object.values(state.machine.states).map(page => {
        return [page.key, state.matches(page.key)];
    })
    return (
        <div className='app'>
            <div className="side">

            </div>
            <div className='center'>
                <Breadcrumbs pages={pages} />
                <div className="logo">
                    <div className="logo-icon">🎨</div>
                    <h1 className="logo-title">The Fine Art Gallery and Auction House</h1>
                </div>
                {welcome && <Home state={state} stateUpdate={stateUpdate} />}
                {lobby && <Lobby state={state} stateUpdate={stateUpdate} />}
                {game && <Game state={state} stateUpdate={stateUpdate} />}
            </div>
            <div className="side">
            </div>
        </div>
    );
}