const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

let mouse = {
    x: -1000,
    y: -1000
};


function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);


    particles = [];

    const amount = Math.min(
        100,
        Math.floor(
            window.innerWidth *
            window.innerHeight /
            14000
        )
    );


    for (let i = 0; i < amount; i++) {

        particles.push({

            x: Math.random() * window.innerWidth,

            y: Math.random() * window.innerHeight,

            vx: (Math.random() - 0.5) * 0.35,

            vy: (Math.random() - 0.5) * 0.35,

            radius: Math.random() * 2 + 0.5,

            type: Math.random()

        });

    }

}


function drawParticle(particle) {

    let color;

    if (particle.type < 0.5) {

        color = "rgba(255, 79, 154, 0.55)";

    } else if (particle.type < 0.75) {

        color = "rgba(255, 216, 77, 0.55)";

    } else {

        color = "rgba(255, 59, 48, 0.5)";

    }


    ctx.beginPath();

    ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;

    ctx.fill();

}


function animate() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    particles.forEach(particle => {

        const dx = mouse.x - particle.x;

        const dy = mouse.y - particle.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );


        /*
         * Частицы реагируют на курсор.
         */

        if (distance < 150 && distance > 0) {

            const force =
                (1 - distance / 150) * 0.8;


            particle.vx -=
                (dx / distance) * force;

            particle.vy -=
                (dy / distance) * force;

        }


        particle.x += particle.vx;
        particle.y += particle.vy;


        /*
         * Постепенно замедляем частицы.
         */

        particle.vx *= 0.985;
        particle.vy *= 0.985;


        /*
         * Если частица вышла за экран —
         * появляется с противоположной стороны.
         */

        if (particle.x < -10)
            particle.x = window.innerWidth + 10;

        if (particle.x > window.innerWidth + 10)
            particle.x = -10;

        if (particle.y < -10)
            particle.y = window.innerHeight + 10;

        if (particle.y > window.innerHeight + 10)
            particle.y = -10;


        drawParticle(particle);

    });


    requestAnimationFrame(animate);

}



/*
 * Движение мыши
 */

window.addEventListener(
    "pointermove",
    event => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

    }
);


/*
 * Когда курсор уходит —
 * частицы перестают реагировать.
 */

window.addEventListener(
    "pointerleave",
    () => {

        mouse.x = -1000;
        mouse.y = -1000;

    }
);


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();

animate();