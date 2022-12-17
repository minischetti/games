import React, { useState, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import stateMachine from './state/machine';
import Prose from './prose/Prose';
import { ArrowLeft, ArrowRight, ArrowUp, HandWaving, Warning } from 'phosphor-react';
import roles from './data/roles';
import rules from './rules/rules';


export function Home({ state, stateUpdate }) {
    return (
        <div className="letter">
            <Prose.Welcome />
            <button onClick={() => stateUpdate("NEXT")}>
                <div>Start</div>
                <ArrowRight size={32} />
            </button>
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
        // stateUpdate({ type: "NEXT" });
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
                <button type="submit">
                        <div>Join Game</div>
                        <ArrowRight size={32} />
                </button>
            </form>
        </>
    );
}
export function Lobby({ state, stateUpdate }) {
    return (
        <div>
            <h2>Participants ({state.context.participants.length})</h2>
            <div className="participants-role-container">
                {(roles).map((role) => {
                    return (
                        <div className="participants-role" key={role.id}>
                            <h3>{role.name}</h3>
                            <p>{role.description}</p>
                            {state.context.participants.filter((participant) => participant.role === "collector").map((participant, index) => (
                            <li key={index}>{participant.name}</li>
                            ))}
                        </div>
                    )})}
            </div>
            <button onClick={() => stateUpdate("BACK")}>
                        <ArrowLeft size={32} />
                        <div>Go Back</div>
                </button>
            <CharacterCreator state={state} stateUpdate={stateUpdate} />
        </div>
    );
}

export function Art({ state, stateUpdate }) {
    const art = state.context.art;
    const isImage = (artwork) => artwork.image?.src;
    const getImage = (artwork) => artwork.image?.src;
    const isColor = (artwork) => artwork.color.r && artwork.color.g && artwork.color.b;
    const getColor = (artwork) => `rgb(${artwork.color.r}, ${artwork.color.g}, ${artwork.color.b})`;
    console.log(art);
    return (
        <div>
            <h2>Art</h2>
            <div className="artwork-list">
                {art.map((artwork, index) => (
                    <div key={index} className="artwork">
                        <div>
                            {isImage(artwork) && <img className="artwork-image" src={getImage(artwork)} alt={artwork.name} />}
                            {isColor(artwork) && 
                                <div className="artwork-color" style={{ backgroundColor: getColor(artwork) }}/>
                            }
                        </div>
                        <div className="artwork-name">{artwork.name}</div>
                        <div className="artwork-artist">{artwork.artist}</div>
                        <div className="artwork-year">{artwork.year}</div>
                        <div className="artwork-value">{artwork.value}</div>
                    </div>
                ))}
            </div>
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
    const welcome = state.matches("welcome");
    const lobby = state.matches("lobby");
    const pre_game = state.matches("pre_game");
    const game = state.matches("game");
    const post_game = state.matches("post_game");
    return (
        <div className='app'>
            <div className="logo">
                <div className="logo-icon">🎨</div>
                <h1 className="logo-title">The Fine Art Gallery and Auction House</h1>
            </div>
            <Breadcrumbs state={state} />
            {welcome && <Home state={state} stateUpdate={stateUpdate} />}
            {lobby && <Lobby state={state} stateUpdate={stateUpdate} />}
        </div>
    );
}