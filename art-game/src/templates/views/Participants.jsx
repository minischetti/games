import React from "react";
import {Card} from "../components/Card";

export function Participants({ participants, roles }) {
    return (
        <div className="participants">
            <h2>Participants ({participants.length})</h2>
            <div className="participants-role-container">
                {roles.map((role) => {
                    return (
                        <Card key={role.id} title={role.name + "s"} description={role.description}>
                            {participants.filter((participant) => participant.role === role.id).map((participant, index) => (
                                <div key={index}>
                                    <li>{participant.name}</li>
                                    {/* {participant.type === "ai" && <div className="chip">AI</div>} */}
                                </div>
                            ))}
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}