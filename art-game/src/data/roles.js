export default [
    {
        id: "collector",
        name: "Collector",
        description: "Submit art for sale, view the gallery and participate in the auction.",
        required: true,
        permissions: {
            view: true,
            bid: true,
            auction: true,
            art: true,
        },
    },
    {
        id: "connoisseur",
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
    {
        id: "artist",
        name: "Artist",
        description: "Submit art for sale and spectate the auction.",
        permissions: {
            view: true,
            bid: false,
            auction: false,
            art: true,
        },
    },
    {
        id: "guest",
        name: "Guest",
        description: "View the gallery and spectate the auction.",
        permissions: {
            view: true,
            bid: false,
            auction: false,
            art: false,
        },
    },
]