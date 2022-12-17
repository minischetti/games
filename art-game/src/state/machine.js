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
                },
            },
        },
        art: {
            entry: [
                (context) => {
                    const art_min = 10;
                    const art = [...context.art];
                    const art_missing = art_min - art.length;
                    if (art_missing) {
                        for (let i = 0; i < art_missing; i++) {
                            art.push({
                                id: art.length,
                                name: `Art ${art.length + 1}`,
                                artist: `Artist ${art.length + 1}`,
                                year: Math.floor(Math.random() * 100) + 1,
                                price: Math.floor(Math.random() * 1000) + 1,
                                color: {
                                    r: Math.floor(Math.random() * 255) + 1,
                                    g: Math.floor(Math.random() * 255) + 1,
                                    b: Math.floor(Math.random() * 255) + 1,
                                },
                            });
                        }
                    }
                    return context.art = art;
                }
            ],
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