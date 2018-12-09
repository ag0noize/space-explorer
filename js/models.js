let camera, renderer, scene, stats;
let planets = [];
let earthPlanet, moon;

export function init(){

    // stats = new Stats();
    // stats.setMode(0);
    // stats.domElement.style.cssText = 'position: absolute; left: 240px; top: 0';
    // document.body.appendChild(stats.domElement);

	renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById('three'), 
		antialias: true, 
		alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	scene = new THREE.Scene();

	window.scene = scene;

	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 0, 100); 


	// set lights
	
	let ambientLight =  new THREE.AmbientLight(0x48545c, 1.5);
	scene.add(ambientLight);

	let pointLight = new THREE.PointLight(0xdfeffa, 1.5, 100);
	pointLight.position.set(-10, 10, 70);
	scene.add(pointLight);


	// create loading manager 

	let manager = new THREE.LoadingManager();

	manager.onProgress = function(item, loaded, total){
		document.getElementById('preloader_text').textContent = (loaded * 100 / total).toFixed(0);
	};

	manager.onLoad = function(){
	
		// load all objects visible and then hide them (except of current) 
		// for smooth transition and to prevent texture loading on planet change

		setTimeout(()=>{
	
		    window.scene.children.forEach(function(object){

		        if (object.type == 'Group'){

		            object.children.forEach(function(child){
				        if (child.type == 'Group'){
				            child.children.forEach(function(subchild){
				                TweenMax.set(subchild.material, {opacity: 0});
				                TweenMax.set(subchild, {visible: false});
				            });
				        } else {	     	
			                TweenMax.set(child.material, {opacity: 0});
			                TweenMax.set(child, {visible: false});
				        }
		            });
		        } 
		    });

		    document.getElementById('start_btn').classList.add('visible');

		}, 100);
	};


	// planet constructor

	class Planet {
		constructor(options){

			this.options = options;

			this.planet = new THREE.Group();
			this.surfGeo = new THREE.SphereGeometry(options.size, 32, 32);
			this.surfMap = new THREE.TextureLoader(manager).load(this.options.surf.map);
			this.surfBump = this.options.surf.bump ? new THREE.TextureLoader(manager).load(this.options.surf.bump) : false;
			this.surfSpec = this.options.surf.specular ? this.options.surf.specular : false;
			
			this.surfMat = new THREE.MeshPhongMaterial({
				map: this.surfMap, 
				transparent: true, 
				specular: this.surfSpec, 
				bumpMap: this.surfBump, 
				shininess: 0, 
				opacity: 1
			});
			
			this.surface = new THREE.Mesh(this.surfGeo, this.surfMat);
			this.surface.name = 'surf';
			this.planet.add(this.surface);


			if (this.options.atmo){

				this.atmoGeo = new THREE.SphereGeometry(this.options.size + 0.07, 32, 32);
				this.atmoMap = new THREE.TextureLoader(manager).load(this.options.atmo.map);
				this.atmoMat = new THREE.MeshPhongMaterial({
					map: this.atmoMap, 
					transparent: true, 
					opacity: 1
				});

				this.atmosphere = new THREE.Mesh(this.atmoGeo, this.atmoMat);
				this.atmosphere.name = 'atmo';
				this.planet.add(this.atmosphere);
			}


			if (this.options.atmoGlow){

				this.atmoGlowMap = new THREE.TextureLoader(manager).load(this.options.atmoGlow.map);
				this.atmoGlowMat = new THREE.SpriteMaterial({
					map: this.atmoGlowMap, 
					color: this.options.atmoGlow.color, 
					blending: THREE.NormalBlending, 
					opacity: 1
				});

				this.atmoGlow = new THREE.Sprite(this.atmoGlowMat);
				this.atmoGlow.scale.set(this.options.atmoGlow.size, this.options.atmoGlow.size);
				this.atmoGlow.name = 'atmoGlow';
				this.planet.add(this.atmoGlow);
			}

			this.planet.name = this.options.name;
			this.planet.tilt = this.options.tilt;
			this.planet.period = this.options.period;

			if (this.options.orbitSize){

				this.planet.orbitSize = this.options.orbitSize;
			}


			// orbit and rotation settings

		    this.axis = -this.planet.tilt * Math.PI / 180,
		    this.speed = 0.0001;

		    // accelerate rotation speed of some planets to make it perceptible

		    if (this.planet.name === 'mercury' || this.planet.name === 'venus'){
				this.speed = 0.01;
		    }

		    if (this.planet.name === 'pluto'){
				this.speed = 0.001;
		    }

		    this.planet.rotation.order = 'ZXY';
		    this.planet.rotation.z = this.axis;

		    // change tilt angle of some planets in the name of beauty

		    if (this.planet.name === 'saturn_planet'){
		    	this.planet.rotation.x = 0.3;
		    } else if (this.planet.name === 'neptune'){
		    	this.planet.rotation.x = -0.5;
		    } else {
		    	this.planet.rotation.x = 0;
		    }

			scene.add(this.planet);
		}

		rotate(){
		    this.planet.rotation.y += (this.speed / this.planet['period']) * 2 * Math.PI;
		}
	}


// create planets 

	let mercury = new Planet({
		name: 'mercury',
		size: 10,
		tilt: 0,
		period: 58.6,
		surf: {
			map: 'img/planets/mercury_t.jpg',
			bump: 'img/planets/mercury_b.jpg',
		}	
	});

	planets.push(mercury);

	//

	let venus = new Planet({
		name: 'venus',
		size: 13.9,
		tilt: 177.3,
		period: 243,
		surf: {
			map: 'img/planets/venus_a.jpg',
		},
		atmoGlow: {
			map: 'img/planets/glow_s.png',
			size: 29.7,
			color: 0xcea759,
		}
	});

	planets.push(venus);

	//

	let earth = new THREE.Group();
	earth.name = 'earth';

	earthPlanet = new Planet({
		name: 'earth_planet',
		size: 14.1,
		tilt: 25.4,
		period: 1,
		surf: {
			map: 'img/planets/earth_t.jpg',
			bump: 'img/planets/earth_b.jpg',
		},
		atmo: {
			map: 'img/planets/earth_a.png',
		},
		atmoGlow: {
			map: 'img/planets/glow_m.png',
			size: 30.2,
			color: 0x2e3e50,
		}
	});

	planets.push(earthPlanet);
	earth.add(earthPlanet.planet);

	moon = new Planet({
		name: 'moon',
		size: 1,
		tilt: 28.3,
		period: 27.3,
		orbitSize: 45,
		surf: {
			map: 'img/planets/moon_t.jpg',
			bump: 'img/planets/moon_b.jpg',
		}
	});

	planets.push(moon);
	earth.add(moon.planet);

	scene.add(earth);

	//

	let mars = new Planet({
		name: 'mars',
		size: 12,
		tilt: 25.2,
		period: 1.02,
		surf: {
			map: 'img/planets/mars_t.jpg',
			bump: 'img/planets/mars_b.jpg',
			specular: 0xa75f3a
		},
		atmoGlow: {
			map: 'img/planets/glow_m.png',
			size: 25.5,
			color: 0x5c6979,
		}
	});

	planets.push(mars);

	//

	let jupiter = new Planet({
		name: 'jupiter',
		size: 18,
		tilt: 3.1,
		period: 0.4,
		surf: {
			map: 'img/planets/jupiter_t.jpg',
		}
	});

	planets.push(jupiter);

	// 

	let saturn = new THREE.Group();
	saturn.name = 'saturn';

	let saturnPlanet = new Planet({
		name: 'saturn_planet',
		size: 17,
		tilt: 26.7,
		period: 0.4,
		surf: {
			map: 'img/planets/saturn_t.jpg',
		}
	});

	planets.push(saturnPlanet);
	saturn.add(saturnPlanet.planet);

	let saturnRingsGeo = new THREE.RingGeometry(10, 48, 50, 5, 1, Math.PI * 2),
		saturnRingsMat = new THREE.MeshPhongMaterial({           
	        map: new THREE.TextureLoader(manager).load('img/planets/saturn_rings.png'),       
	        shininess: 3,
	        emissive: 10,
	        side: THREE.DoubleSide,
	        transparent: true,
	        opacity: 1,
	    });

	let saturnRings = new THREE.Mesh(saturnRingsGeo, saturnRingsMat); 
	saturnRings.rotation.set(-1.39, 0.466, -0.2);

	saturn.add(saturnRings);
    scene.add(saturn);

    // 

	let uranus = new THREE.Group();
	uranus.name = 'uranus';

	let uranusPlanet = new Planet({
		name: 'uranus_planet',
		size: 16,
		tilt: 97.7,
		period: 0.7,
		surf: {
			map: 'img/planets/uranus_t.jpg',
		}
	});

	planets.push(uranusPlanet);
	uranus.add(uranusPlanet.planet);

	let uranusRingsGeo = new THREE.RingGeometry(10, 35, 50, 5, 1, Math.PI * 2),
		uranusRingsMat = new THREE.MeshPhongMaterial({           
	        map: new THREE.TextureLoader(manager).load('img/planets/uranus_rings.png'),  
	        shininess: 3,
	        emissive: 10,
	        side: THREE.DoubleSide,
	        transparent: true,
	        opacity: 1,
	    });

	let uranusRings = new THREE.Mesh(uranusRingsGeo, uranusRingsMat); 

	uranus.add(uranusRings);
    scene.add(uranus);

 	// 

	let neptune = new Planet({
		name: 'neptune',
		size: 16,
		tilt: 28.3,
		period: 0.7,
		surf: {
			map: 'img/planets/neptune_t.jpg',
		}
	});

	planets.push(neptune);

	// 

	let pluto = new Planet({
		name: 'pluto',
		size: 10,
		tilt: 122.5,
		period: 6.4,
		surf: {
			map: 'img/planets/pluto_t.jpg',
			bump: 'img/planets/pluto_b.jpg',
		}
	});

	planets.push(pluto);
}


// animate moon orbit

let theta = 0,
	dTheta = 2 * Math.PI / 5000;

function moonOrbit(moon){
	let orbitSize = moon.planet.orbitSize;

  	moon.planet.position.x = orbitSize * Math.cos(theta);
  	moon.planet.position.z = orbitSize * Math.sin(theta);
}


export function animate(){

    // stats.begin();	

  	requestAnimationFrame(animate);

  	theta += dTheta;

	planets.forEach(function(planet){
		planet.rotate();
	});

  	// animate earth atmosphere
  
	earthPlanet.planet.children[1].rotation.y += 0.0002;

	moonOrbit(moon);


	renderer.render(scene, camera);

    // stats.end();
}


// resize canvas on windows change

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight); 
}

window.addEventListener('resize', onWindowResize);







