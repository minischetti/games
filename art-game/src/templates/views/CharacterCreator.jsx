import { UserPlus } from "phosphor-react";
import React from "react";
import roles from "../../data/roles";
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
        <div className='character-creator'>
            <h2>Character Creator</h2>
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
                        {roles.map(role => (
                            <div key={role.id} className='table-row role'>
                                <input type="radio" name="role" value={role.id} />
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
                    <UserPlus size={32} />
                </button>
            </form>
        </div>
    );
}