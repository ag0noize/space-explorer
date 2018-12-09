import {init, animate} from './models.js';

window.onload = function(){

	if (window.outerWidth < 1024){

		document.querySelector('.mobile_notification').style.display = 'block';
		
		return false;

	} else {	

		const initAnimation = new TimelineLite(),
			  enterAniamtion = new TimelineLite();

		let lsTitle = document.getElementById('loadscreen_title'),
			lsObject = document.getElementById('current_system'),
			lsPreloader = document.getElementById('preloader'),
			lsBtn = document.getElementById('start_btn'),
			lsItself = document.getElementById('loadscreen'); 

		initAnimation.to(lsTitle, 1.5, {delay: 1, autoAlpha: 1, ease: Sine.easeOut})
			  		 .to(lsTitle, 0.7, {marginTop: '-170px', ease: Power1.easeInOut}, '-=0.7')
			  		 .to(lsObject, 1.5, {autoAlpha: 1, ease: Sine.easeOut})
			  		 .to(lsObject, 0.7, {marginTop: '100px', ease: Power1.easeInOut}, '-=0.7')
			  		 .to(lsPreloader, 1.5, {autoAlpha: 1, scale: 1, ease: Sine.easeOut, onComplete: ()=>{ init(); animate(); }});


		lsBtn.addEventListener('click', () => {

			let planetTitle = document.querySelector('.planet_title'),
				readMoreBtn = document.querySelector('.read_more'),
				featuresLeft = document.querySelector('.pf_left').children,
				featuresRight = document.querySelector('.pf_right').children;

			enterAniamtion.to(lsItself, 0.5, {autoAlpha: 0, scale: 1.2, ease: Sine.easeOut})
				  		  .set(lsItself, {display: 'none'})
						  .to([planetTitle, readMoreBtn], 1.5, {autoAlpha: 1, ease: Sine.easeOut}, '+=0.3')
		  				  .staggerTo(featuresLeft, 1, {opacity: 1, ease: Power1.easeOut}, 0.1, '-=1')
		  				  .staggerTo(featuresRight, 1, {opacity: 1, ease: Power1.easeOut}, 0.1, '-=1.3');


		  	// show initial planet

		  	let initPlanet = window.scene.children.find(planet => planet.name === window.initialPlanet);

		    initPlanet.children.forEach(function(child){

				if (child.type == 'Group'){

				    child.children.forEach(function(subchild){
				        TweenMax.to(subchild.material, 0.3, {delay: 1, opacity: 1, ease: Power1.easeOut});
				        TweenMax.set(subchild, {delay: 1, visible: true});
				    });

				} else {	

				    TweenMax.to(child.material, 0.3, {delay: 1, opacity: 1, ease: Power1.easeOut});
				    TweenMax.set(child, {delay: 1, visible: true});
				}
		    });
		});
	}

}






