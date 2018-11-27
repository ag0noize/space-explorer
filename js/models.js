var camera, renderer, scene, stats;
var mercury, venus, earth, earthPlanet, moon, mars, jupiter, saturn, saturnPlanet, uranus, neptune, pluto;

export function init(){
    // stats = new Stats();
    // stats.setMode(0);
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.left = '240px';
    // stats.domElement.style.top = '0px';
    // document.body.appendChild(stats.domElement);

	renderer = new THREE.WebGLRenderer({canvas: document.getElementById('three'), antialias: true, alpha: true});
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
			
	// pointLight.position.set(-10,0,40);
	pointLight.position.set(-10, 10, 70);

	scene.add(pointLight);


	let manager = new THREE.LoadingManager();

	manager.onProgress = function(item, loaded, total){
		document.getElementById('preloader_text').textContent = (loaded * 100 / total).toFixed(0);
	};

	manager.onLoad = function(){
	
		// load all objects visible and then hide them (except of current) 
		// for smooth transition and to prevent texture loading on planet change

		setTimeout(()=>{
	
		    window.scene.children.forEach(function(object){
		        // if (object.type == 'Group' && object.name != window.initialPlanet){
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

	function planetConstructor(options){
		let planet = new THREE.Group();

		let surfGeo = new THREE.SphereGeometry(options.size, 32, 32),
			surfMap = new THREE.TextureLoader(manager).load(options.surf.map),
			surfBump = options.surf.bump ? new THREE.TextureLoader(manager).load(options.surf.bump) : false,
			surfSpec = options.surf.specular ? options.surf.specular : false,
			surfMat = new THREE.MeshPhongMaterial({map: surfMap, transparent: true, specular: surfSpec, bumpMap: surfBump, shininess: 0, opacity: 1}),
			surface = new THREE.Mesh(surfGeo, surfMat);

		surface.name = 'surf';

		planet.add(surface);

		if (options.atmo){
			let atmoGeo = new THREE.SphereGeometry(options.size + 0.07, 32, 32),
				atmoMap = new THREE.TextureLoader(manager).load(options.atmo.map),
				atmoMat = new THREE.MeshPhongMaterial({map: atmoMap, transparent: true, opacity: 1}),
				atmosphere = new THREE.Mesh(atmoGeo, atmoMat);

			atmosphere.name = 'atmo';
			planet.add(atmosphere);
		}

		if (options.atmoGlow){
			let	atmoGlowMap = new THREE.TextureLoader(manager).load(options.atmoGlow.map),
				atmoGlowMat = new THREE.SpriteMaterial({map: atmoGlowMap, color: options.atmoGlow.color, blending: THREE.NormalBlending, opacity: 1}),
				atmoGlow = new THREE.Sprite(atmoGlowMat);
				atmoGlow.scale.set(options.atmoGlow.size, options.atmoGlow.size);

			atmoGlow.name = 'atmoGlow';
			planet.add(atmoGlow);
		}

		planet.name = options.name;
		planet.tilt = options.tilt;
		planet.period = options.period;

		if (options.orbitSize){
			planet.orbitSize = options.orbitSize;
		}

		scene.add(planet);

		return planet;
	}


// create planets 

	mercury = planetConstructor({
		name: 'mercury',
		size: 10,
		tilt: 0,
		period: 58.6,
		surf: {
			map: 'img/planets/mercury_t.jpg',
			bump: 'img/planets/mercury_b.jpg',
		}	
	});

	//

	venus = planetConstructor({
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

	// 

	earth = new THREE.Group();

	earthPlanet = planetConstructor({
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

	earth.add(earthPlanet);

	moon = planetConstructor({
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

	earth.add(moon);
	earth.name = 'earth';
	scene.add(earth);

	// 

	mars = planetConstructor({
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

	// 

	jupiter = planetConstructor({
		name: 'jupiter',
		size: 18,
		tilt: 3.1,
		period: 0.4,
		surf: {
			map: 'img/planets/jupiter_t.jpg',
		}
	});

	// 

	saturn = new THREE.Group();
	saturn.name = 'saturn';

	saturnPlanet = planetConstructor({
		name: 'saturn_planet',
		size: 17,
		tilt: 26.7,
		period: 0.4,
		surf: {
			map: 'img/planets/saturn_t.jpg',
		}
	});

	saturn.add(saturnPlanet);

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

	uranus = new THREE.Group();
	uranus.name = 'uranus';

	let uranusPlanet = planetConstructor({
		name: 'uranus_planet',
		size: 16,
		tilt: 97.7,
		period: 0.7,
		surf: {
			map: 'img/planets/uranus_t.jpg',
		}
	});

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

	uranus.add(uranusPlanet);
	uranus.add(uranusRings);

    scene.add(uranus);

    // 

	neptune = planetConstructor({
		name: 'neptune',
		size: 16,
		tilt: 28.3,
		period: 0.7,
		surf: {
			map: 'img/planets/neptune_t.jpg',
		}
	});

	// 

	pluto = planetConstructor({
		name: 'pluto',
		size: 10,
		tilt: 122.5,
		period: 6.4,
		surf: {
			map: 'img/planets/pluto_t.jpg',
			bump: 'img/planets/pluto_b.jpg',
		}
	});


	window.mercury = mercury;
	window.venus = venus;
	window.earth = earth;
	window.mars = mars;
	window.jupiter = jupiter;
	window.saturn = saturn;
	window.uranus = uranus;
	window.neptune = neptune;
	window.pluto = pluto;
}


// animate planet's rotation 

function planetRotation(planet){
    let axis = -planet.tilt * Math.PI / 180,
    	speed = 0.0001;

    // accelerate some planets rotation speed to make it visible

    if (planet.name === 'mercury' || planet.name === 'venus'){
		speed = 0.01;
    }

    if (planet.name === 'pluto'){
		speed = 0.001;
    }

    planet.rotation.order = 'ZXY';
    planet.rotation.z = axis;

    if (planet.name === 'saturn_planet'){
    	planet.rotation.x = 0.3;
    } else if (planet.name === 'neptune'){
    	planet.rotation.x = -0.5;
    } else {
    	planet.rotation.x = 0;
    }

    planet.rotation.y += (speed / planet['period']) * 2 * Math.PI;
};


// animate moons

var theta = 0,
	dTheta = 2 * Math.PI / 5000;

function moonOrbit(moon){
	let orbitSize = moon.orbitSize;
  	moon.position.x = orbitSize * Math.cos(theta);
  	moon.position.z = orbitSize * Math.sin(theta);
};


export function animate(){
    // stats.begin();	
  	requestAnimationFrame(animate);

  	theta += dTheta;

  	earth.children[0].getObjectByName('atmo').rotation.y += 0.0002;

	planetRotation(mercury);
	planetRotation(venus);
	planetRotation(earth.children[0]);
	planetRotation(moon);
	moonOrbit(moon);
	planetRotation(mars);
	planetRotation(jupiter);
	planetRotation(saturn.children[0]);
	planetRotation(uranus.children[0]);
	planetRotation(neptune);
	planetRotation(pluto);

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







