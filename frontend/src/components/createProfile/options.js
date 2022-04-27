export const options = {
    fpsLimit: 90,
    particles: {
        bounce: {
            vertical: {
                value: {
                    min: 0.75,
                    max: 0.85,
                },
            },
        },
        color: {
            value: ["#332fd0", "#9f3ace"],
        },
        number: {
            value: 0,
        },
        destroy: {
            mode: "split" /* split */,
            split: {
                count: 2,
                factor: {
                    value: {
                        min: 1.1,
                        max: 2,
                    },
                },
                rate: {
                    value: {
                        min: 2,
                        max: 3,
                    },
                },
            },
        },
        opacity: {
            value: 1,
        },
        size: {
            value: {
                min: 10,
                max: 20,
            },
        },
        move: {
            enable: true,
            gravity: {
                enable: true,
                maxSpeed: 50,
            },
            speed: {
                min: 8,
                max: 15,
            },
            direction: "none" /* none */,
            random: true,
            straight: false,
            outModes: {
                bottom: "split" /* split */,
                default: "bounce" /* bounce */,
                top: "none" /* none */,
            },
            trail: {
                enable: false,
                fillColor: "#fff",
                length: 5,
            },
        },
    },
    detectRetina: true,
    background: {
        color: "#fff",
    },
    emitters: {
        direction: "top",
        life: {
            count: 0,
            duration: 0.15,
            delay: 3,
        },
        rate: {
            delay: 0.1,
            quantity: 5,
        },
        size: {
            width: 0,
            height: 0,
        },
    },
};
