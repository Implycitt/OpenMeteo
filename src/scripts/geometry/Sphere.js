import {
    Group,
    Mesh,
    SphereGeometry,
    TextureLoader,
    MeshPhongMaterial,
    AmbientLight,
    PointLight,
    BufferGeometry,
    PointsMaterial,
    Points,
    Float32BufferAttribute,
} from "three";

import gsap from "gsap";
import { InteractionManager } from "three.interactive";

import earth_daymap from "../../assets/img/earth_daymap.jpg";
import earth_bump from "../../assets/img/earthbump.jpg";
import earth_clouds from "../../assets/img/earthCloud.png";
import star from "../../assets/img/stars.png";

export const createSphere = (core) => {
    const { camera, renderer, scene } = core;
    const earthMaterial = new MeshPhongMaterial({
        map: new TextureLoader().load(earth_daymap),
        bumpMap: new TextureLoader().load(earth_bump),
        bumpScale: 2
    });
    const sprite = new TextureLoader().load(star);
    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        map: sprite
    });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute("position", new Float32BufferAttribute(starVertices, 3));
    const stars = new Points(starGeometry, starMaterial);
    const cloudGeometry = new SphereGeometry(5.15, 100, 100);
    const cloudMaterial = new MeshPhongMaterial({
        map: new TextureLoader().load(earth_clouds),
        transparent: true
    });
    const point = new Points(starGeometry, starMaterial);
    const cloudMesh = new Mesh(cloudGeometry, cloudMaterial);
    const ambientlight = new AmbientLight(0xffffff, 0.5);
    const pointLight = new PointLight(0xffffff, 20); pointLight.position.set(5, 3, 5);
    const geometry = new SphereGeometry(5, 100, 100);
    const earth = new Mesh(geometry, earthMaterial);
    const group = new Group();
    const mouse = { x: null, y: null };
    const interactionManager = new InteractionManager(
        renderer,
        camera,
        renderer.domElement
    );
    let isDown = false;
    let startX;
    let scrollLeft;

    camera.position.z = 15;

    scene.add(stars);
    scene.add(point);
    scene.add(cloudMesh);
    scene.add(ambientlight);
    scene.add(pointLight);
    scene.add(point);
    group.add(earth);
    group.add(cloudMesh);
    scene.add(group);

    interactionManager.add(earth);

    document.addEventListener("mousemove", e => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 + 1;
    });

    group.addEventListener("mousedown", e => {
        isDown = true;
        startX = e.pageX - group.offsetLeft;
        scrollLeft = group.scrollLeft;
    });

    group.addEventListener("mouseleave", () => {
        isDown = false;
    });

    group.addEventListener("mouseup", () => {
        isDown = false;
    });

    group.addEventListener("mousemove", e => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX - group.offsetLeft;
        const walk = x - startX;
    });

    earth.addEventListener("mousedown", () => {
        gsap.to(camera.position, {
            x: -4,
            z: 17,
            duration: 2.5
        });

        const exit = document.getElementById("exit");
        exit.removeAttribute("hidden");
        document.getElementById("container").removeAttribute("hidden");
        document.getElementById("searching").removeAttribute("hidden");


        exit.addEventListener("click", () => {
            exit.setAttribute("hidden", "");
            document.getElementById("rem").setAttribute("hidden", "");
            document.getElementById("container").setAttribute("hidden", "");
            document.getElementById("searchButton").setAttribute("hidden", "");

            if (document.getElementById("weather") != null) {
                document.getElementById("weather").style.display = "none";
            }

            gsap.to(camera.position, {
                x: 0,
                z: 15,
                duration: 2.5
            });
        });

        document.getElementById("rem").removeAttribute("hidden");
    });

    const animate = () => {
        earth.rotation.y += 0.001;
        cloudMesh.rotation.y += 0.001;
        gsap.to(group.rotation, { y: mouse.x * 0.5 });

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
};
