
document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Move dot instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Move outline with a slight delay using animate for smooth trailing
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .btn, .exp-tab, .project-card, .cert-badge, .cube-container');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hovering');
        });
    });

    // --- Interactive Cube Logic ---
    const cubeContainer = document.getElementById('tech-cube');
    let isDown = false;
    let startX, startY, currentX = 0, currentY = 0;

    cubeContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - currentX;
        startY = e.pageY - currentY;
        cubeContainer.style.animation = 'none';
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        currentX = e.pageX - startX;
        currentY = e.pageY - startY;
        cubeContainer.style.transform = `rotateX(${-currentY * 0.5}deg) rotateY(${currentX * 0.5}deg)`;
    });

    // --- Interactive Experience Tabs Logic ---
    const tabs = document.querySelectorAll('.exp-tab');
    const panes = document.querySelectorAll('.exp-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(tab.getAttribute('data-target'));
            targetPane.classList.add('active');
        });
    });
});