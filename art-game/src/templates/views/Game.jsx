import roles from "../../data/roles"
import { Actions } from "../components/Actions"
import { Participants } from "./Participants"
import { Tag, Swatches } from 'phosphor-react';

export function Game({state, stateUpdate}) {
    const actions = [
        ["auction", <Tag size={32} />],
        ["draw", <Swatches size={32} />]
    ]
    return (
        <div>
            <Participants participants={state.context.participants} roles={roles} />
            <Actions actions={actions}/>
        </div>
    )
}