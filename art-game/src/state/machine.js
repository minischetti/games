import { createMachine, assign } from 'xstate';

export default createMachine({
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