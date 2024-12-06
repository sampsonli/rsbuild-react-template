import { Model, define } from 'mtor';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import Stats from 'three/addons/libs/stats.module';
import Delaunator from 'delaunator';



@define(module)
class LoginModel extends Model {
    loaded = false;

    /**
     * @type {number}
     */
    num = 0;

    scene;

    group;



    initScene(ele) {
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;



// 设置场景
        const scene = new THREE.Scene();
        // lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(-200, -200, 200);
        // dirLight.position.setScalar(100);
        scene.add(dirLight)

// 设置相机
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
        camera.up = new THREE.Vector3(0, 0, 1);
        camera.position.set(50, 100, 250);
        camera.position.setScalar(100);


// 设置渲染器
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.physicallyCorrectLights = true;
        ele.appendChild(renderer.domElement);

        const clock = new THREE.Clock();
        const stats = new Stats();
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 10;
        controls.maxDistance = 200000;
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.enableRotate = true;

        const axesHelper = new THREE.AxesHelper(2000); // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        scene.add(axesHelper);

// 渲染循环
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            const delta = clock.getDelta();
            controls.update(delta);
            stats.update();
        }
        animate();

        const doResize = () => {
            const w = ele.offsetWidth;
            const h = ele.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', doResize);
        const doDestroy = () => {
            window.removeEventListener('resize', doResize);
        };


        this.scene = scene;
        let group = new THREE.Group();
        group.position.set(-400, 200, 0);
        scene.add(group);
        this.group = group;
    }
    processPoints(data) {
        const geom = new THREE.BufferGeometry();
        geom.attributes.position = new THREE.BufferAttribute(data.position, 3);
        geom.attributes.color = new THREE.BufferAttribute(data.color, 3);
        const cloud = new THREE.Points(
            geom,
            new THREE.PointsMaterial({
                // color: 'white',
                size: 0.05,
                vertexColors: true,
            })
        );
        // this.group.add(cloud);
        const indexDelaunay = new Delaunator(data.indexD);

        const meshIndex = []; // delaunay index => three.js index
        for (let i = 0; i < indexDelaunay.triangles.length; i++){
            meshIndex.push(indexDelaunay.triangles[i]);
        }

        geom.setIndex(meshIndex); // add three.js index to the existing geometry
        geom.computeVertexNormals();
        const mesh = new THREE.Mesh(
            geom, // re-use the existing geometry
            new THREE.MeshLambertMaterial({
                // color: 'yellow',
                vertexColors: true,
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        );

        this.group.add(mesh);

    }

    init(ele) {
        if (this.loaded) return;
        this.initScene(ele);
        const worker = new Worker('/webworker.js');
        worker.addEventListener('message', (e) => {
            const { data, type } = e.data;
            if (type === 'staticPoints') { // 无人机
                this.staticPoints = data;
                this.processPoints(data);
            }
        });

        // worker.postMessage({ type: 'staticPoints', url: '/cloud_colored_xyz0729.pcd' });
        worker.postMessage({ type: 'staticPoints', url: '2024-09-11.pcd' });
        // worker.postMessage({ type: 'staticPoints', url: '/CloudProcessed.pcd' });
        // worker.postMessage({ type: 'staticPoints', url: '/left.pcd' });
        // worker.postMessage({ type: 'staticPoints', url: '/2.pcd' });














       /*  const size = { x: 400, y: 400 };
        const pointsCount = 10000;
        const points3d = [];
        for (let i = 0; i < pointsCount; i++) {
            let x = THREE.MathUtils.randFloatSpread(size.x);
            let y = THREE.MathUtils.randFloatSpread(size.y);
            let z = noise.perlin2(x / size.x * 5, y / size.y * 5) * 50;
            points3d.push(new THREE.Vector3(x, y, z));
        }

        const geom = new THREE.BufferGeometry().setFromPoints(points3d);
        const cloud = new THREE.Points(
            geom,
            new THREE.PointsMaterial({
                color: 'white',
                size: 1
            })
        );
        scene.add(cloud);

// triangulate x, z
        const indexDelaunay = Delaunator.from(
            points3d.map(v => {
                return [v.x, v.y];
            })
        );

        const meshIndex = []; // delaunay index => three.js index
        for (let i = 0; i < indexDelaunay.triangles.length; i++){
            meshIndex.push(indexDelaunay.triangles[i]);
        }

        geom.setIndex(meshIndex); // add three.js index to the existing geometry
        geom.computeVertexNormals();
        const mesh = new THREE.Mesh(
            geom, // re-use the existing geometry
            new THREE.MeshLambertMaterial({
                color: 'yellow',
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        );

        scene.add(mesh); */







        /* const size2 = { x: 400, z: 400 };
        const points3d2 = [];
        for (let i = 0; i < pointsCount; i++) {
            let x = THREE.MathUtils.randFloatSpread(size2.x);
            let z = THREE.MathUtils.randFloatSpread(size2.z);
            let y = noise.perlin2(x / size2.x * 5, z / size2.z * 5) * 50 + 100;
            points3d2.push(new THREE.Vector3(x, y, z));
        }

        const geom2 = new THREE.BufferGeometry().setFromPoints(points3d2);


// triangulate x, z
        const indexDelaunay2 = Delaunator.from(
            points3d2.map(v => {
                return [v.x, v.z];
            })
        );

        const meshIndex2 = []; // delaunay index => three.js index
        for (let i = 0; i < indexDelaunay2.triangles.length; i++){
            meshIndex2.push(indexDelaunay2.triangles[i]);
        }

        geom2.setIndex(meshIndex2); // add three.js index to the existing geometry
        geom2.computeVertexNormals();
        const mesh2 = new THREE.Mesh(
            geom2, // re-use the existing geometry
            new THREE.MeshLambertMaterial({
                color: '#2493c1',
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        );

        scene.add(mesh2); */



        this.loaded = true;
    }

    changeNum() {
        this.num += 10;
    }
}
export default LoginModel;

