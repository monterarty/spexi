var Webflow = Webflow || [];
Webflow.push(function () {
	var detect = new MobileDetect(window.navigator.userAgent);

	const getOS = () => {
		"use strict";
		var userAgent = window.navigator.userAgent,
			platform = window.navigator.userAgentData ? window.navigator.userAgentData : window.navigator.platform || window.navigator.platform,
			macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS'],
			windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
			iosPlatforms = ['iPhone', 'iPad', 'iPod'],
			os = null;
		if (macosPlatforms.indexOf(platform) !== -1) {
			os = 'macOS';
		} else if (iosPlatforms.indexOf(platform) !== -1) {
			os = 'iOS';
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
			os = 'Windows';
		} else if (/Huawei/.test(userAgent)) {
			os = 'Huawei';
		} else if (/Android/.test(userAgent)) {
			os = 'AndroidOS';
		} else if (/Linux/.test(platform)) {
			os = 'Linux';
		}
		return os;
	}

	const iOS = () => {
		"use strict";
		return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
			(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	}

	var os = detect.os();
	if (os === null || os == 'AndroidOS') {
		os = getOS();
		if (os == 'macOS') {
			if (iOS()) {
				os = 'iOS';
			}
		}
	}

	const isTouchDevice = () => {
		return (('ontouchstart' in window) ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0));
	}

	if (isTouchDevice()) {
		document.documentElement.classList.add('is--touch-device', 'is--mobile');
	}

	if (['iOS', 'AndroidOS', 'Huawei'].indexOf(os) + 1) {
		document.documentElement.classList.add('is--touch-device', 'is--mobile');
		switch (os) {
			case 'iOS':
				document.documentElement.classList.add('is--ios');
				break;
			case 'AndroidOS':
				document.documentElement.classList.add('is--android');
				break;
			case 'Huawei':
				document.documentElement.classList.add('is--android');
				break;
		}
	}


	const heroSection = gsap.utils.toArray(".hero__section");
	const heroSlider = new Swiper('.swiper', {
		speed: 1000,
		effect: 'fade',
		autoplay: {
			delay: 4000,
		}
	});

	heroSlider.on('slideChange', function (swiper, event) {
		heroSection[0].setAttribute('data-hgs', swiper.activeIndex + 1);
	})

	ScrollTrigger.create({
		trigger: heroSection,
		start: "top 80px",
		end: "bottom 80px",
		onEnter: function () {
			heroSlider.autoplay.start();
		},
		onEnterBack: function () {
			heroSlider.autoplay.start();
		},
		onLeave: function () {
			heroSlider.autoplay.stop();
		}
	});

	const changeNavColor = (section) => {
		const body = document.querySelector('body');

		if (section.getAttribute('data-black-nav')) {
			if (!body.classList.contains('is--black-nav'))
				body.classList.add('is--black-nav');
		} else {
			body.classList.remove('is--black-nav');
		}
	};
	const sections = gsap.utils.toArray(".section");

	sections.forEach(function (section, index) {
		ScrollTrigger.create({
			trigger: section,
			start: "top 80px",
			end: "bottom 80px",
			onEnter: function () {
				changeNavColor(section);
			},
			onEnterBack: function () {
				changeNavColor(section);
			}
		});
	});


	const features = gsap.utils.toArray(".features__content-item");
	const featuresGrid = document.querySelector('.features__grid-wrapper');

	const changeFeatureGrid = (feature, index) => {
		featuresGrid.setAttribute('data-fgs', index + 1);
	}


	features.forEach(function (feature, index) {

		let end = '';
		let start = '';

		function createScrollTriggers() {
			console.log(start);
			gsap.to(feature, {
				scrollTrigger: {
					trigger: feature,
					start: start,
					end: end,
					//markers:true,
					onEnter: function () {
						feature.style.opacity = 1;
						changeFeatureGrid(feature, index);
					},
					onLeave: function () {
						if (window.innerWidth < 468 && index < features.length - 1) {
							feature.style.opacity = 0;
						}
					},
					onEnterBack: function () {
						feature.style.opacity = 1;
						changeFeatureGrid(feature, index);
					}
				}
			});
		}

		ScrollTrigger.matchMedia({
			'(min-width:468px)': function () {
				start = "top+=10% center";
				end = "bottom+=10% center";

				createScrollTriggers();
			},
			'(max-width:467px)': function () {
				start = "top-=30% center";
				end = "bottom-=30% center";

				createScrollTriggers();
			}
		})
	})
});
window.onscroll = function () {
	if ($('.w-nav-button').hasClass('w--open'))
		$('.w-nav-button').trigger('click');
}

const transitionEndEventName = getTransitionEndEventName();

function Dropdowns(options) {
	this.dropdownsDOM = document.querySelectorAll(options.selector);
	this.openFirst = options.openFirst;
	this.scrollToOpen = options.scrollToOpen;
	this.onlyOneOpened = options.onlyOneOpened;
	this.dropdowns = [];

	this.prepareDropdowns();
	this.attachEventHandlers();
}

Dropdowns.prototype.attachEventHandlers = function () {
	const self = this;

	this.dropdowns.forEach((dropdown) => {
		dropdown.toggle.addEventListener("click", (event) => {
			if (dropdown.opened) {
				dropdown.closeDropdown();
			} else {
				dropdown.openDropdown();
			}
			if (self.onlyOneOpened) {
				this.dropdowns.forEach((siblingDropdown) => {
					if (dropdown != siblingDropdown && siblingDropdown.opened)
						siblingDropdown.closeDropdown();
				})
			}

			if (self.scrollToOpen && dropdown.opened) {
				setTimeout(function () {
					dropdown.scrollToOpenDropdown();
				}, 550)

			}
		});

		dropdown.dropdownList.addEventListener("transitionend", () => {
			ScrollTrigger.refresh();
		});
	})
}


Dropdowns.prototype.prepareDropdowns = function () {
	this.dropdownsDOM.forEach((dropdown, index) => {
		if (this.openFirst && index == 0) {
			this.dropdowns.push(new Dropdown({
				element: dropdown,
				opened: true
			}));
		} else {
			this.dropdowns.push(new Dropdown({
				element: dropdown,
				opened: false
			}));
		}
	})
}

function Dropdown(options) {
	this.dropdown = options.element;
	this.opened = options.opened;
	this.toggle = this.dropdown.querySelector('.cases__dropdown-toggle');
	this.dropdownList = this.dropdown.querySelector('.cases__dropdown-list');
	this.dropdownContent = this.dropdown.querySelector('.cases__dropdown-content');

	this.setInitialPosition();
	return this;
}

Dropdown.prototype.setInitialPosition = function () {
	if (this.opened) {
		this.openDropdown();
	} else {
		this.closeDropdown();
	}
}

Dropdown.prototype.scrollToOpenDropdown = function () {
	const topPos = this.dropdown.getBoundingClientRect().top + window.pageYOffset - 20
	window.scrollTo({
		top: topPos, // scroll so that the element is at the top of the view
		behavior: 'smooth' // smooth scroll
	})
}

Dropdown.prototype.closeDropdown = function () {
	this.dropdownList.style.height = 0;
	this.dropdownContent.style.opacity = 0;
	this.opened = 0;
	this.dropdown.classList.remove('is--open');
}

Dropdown.prototype.openDropdown = function () {
	this.dropdownList.style.height = this.dropdownContent.offsetHeight + 'px';
	this.dropdownContent.style.opacity = 1;
	this.opened = 1;
	this.dropdown.classList.add('is--open');
}

function getTransitionEndEventName() {
	var transitions = {
		"transition": "transitionend",
		"OTransition": "oTransitionEnd",
		"MozTransition": "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	}
	let bodyStyle = document.body.style;
	for (let transition in transitions) {
		if (bodyStyle[transition] != undefined) {
			return transitions[transition];
		}
	}
}

const dropdowns = new Dropdowns({
	selector: '.cases__dropdown',
	openFirst: 1,
	scrollToOpen: 1,
	onlyOneOpened: 1
});

//Phone Input mask 
const resizePhoneSelectList = (input) => {
	console.log(input);
	const formPhoneField = input.closest('.form__phone-wrap');
	const currentModal = input.closest('.remodal');
	const formCountryList = currentModal.querySelector('.iti__country-list');

	if (formCountryList) {
		formCountryList.style.width = formPhoneField.clientWidth + 'px';
	}
}

const phoneFields = document.querySelectorAll("[data-phone-input]");
const phoneIntelObjectArray = []
if (phoneFields) {
	phoneFields.forEach((input) => {
		const intlObject = window.intlTelInput(input, {
			initialCountry: "auto",
			preferredCountries: ["us", "ca"],
			dropdownContainer: input.closest('.form__phone-wrap'),
			geoIpLookup: callback => {
				fetch("https://ipapi.co/json")
					.then(res => res.json())
					.then(data => callback(data.country_code))
					.catch(() => callback("us"));
			}
		});
		intlObject.promise.then(() => {
			console.log("Initialised!");
		});
		phoneIntelObjectArray.push(intlObject);
		window.onresize = (e) => {
			if (document.documentElement.classList.contains('remodal-is-locked'))
				resizePhoneSelectList(input);
		}

	})
}

//Form Validation 
const nameInputs = document.querySelectorAll('input[data-name-input]');
const emailInputs = document.querySelectorAll('input[data-email-input]');
const phoneInputs = document.querySelectorAll('input[data-phone-input]');

//Запрет ввода цифр в поле имени 
if (nameInputs) {
	nameInputs.forEach((input) => {
		input.addEventListener('keypress', function (e) {
			console.log(e);
			//console.log(e.keyCode);
			if (e.keyCode != 8 && e.keyCode != 46 && (input.value.length > 49 || e.key && e.key.match(/[^а-яА-ЯЁёІіЇїҐґЄєa-zA-ZẞßÄäÜüÖöÀàÈèÉéÌìÍíÎîÒòÓóÙùÚúÂâÊêÔôÛûËëÏïŸÿÇçÑñœ’`'.-\s]/)))
				return e.preventDefault();
		});
		input.addEventListener('input', function (e) {
			console.log(e);
			if (e.inputType == "insertFromPaste") {
				// На случай, если умудрились ввести через копипаст или авто-дополнение.
				input.value = input.value.replace(/[^а-яА-ЯЁёІіЇїҐґЄєa-zA-ZẞßÄäÜüÖöÀàÈèÉéÌìÍíÎîÒòÓóÙùÚúÂâÊêÔôÛûËëÏïŸÿÇçÑñœ’`'.-\s]/g, "").slice(0, 50);
			}
		});
	});
}
// Запрет ввода спецсимволов и букв в поле ввода телефона
if (phoneInputs) {
	phoneInputs.forEach((input) => {
		input.addEventListener('keypress', function (e) {
			console.log(e);
			if (input.value.length > 16 || e.key && e.key.match(/[^0-9\+]/))
				return e.preventDefault();
		});
		input.addEventListener('input', function (e) {
			console.log(e);
			if (e.inputType == "insertFromPaste") {
				// На случай, если умудрились ввести через копипаст или авто-дополнение.
				input.value = input.value.replace(/[^0-9\+]/g, "").slice(0, 50);
			}
		});
	});
}

//Запрет ввода спецсимволов в поле email
if (emailInputs) {
	emailInputs.forEach((input) => {
		input.addEventListener('keypress', function (e) {
			if (e.keyCode != 8 && e.keyCode != 46 && (input.value.length > 49 || e.key && e.key.match(/[^0-9a-zA-Z-_@.-\s]/)))
				return e.preventDefault();
		});
		input.addEventListener('input', function (e) {
			console.log(e);
			if (e.inputType == "insertFromPaste") {
				// На случай, если умудрились ввести через копипаст или авто-дополнение.
				input.value = input.value.replace(/[^0-9a-zA-Z-_@.-\s]/g, "").slice(0, 50);
			}
		});
	});
}

// Валидация форм
function removeErrorClassOnInput(input) {
	input.addEventListener('input', () => {
		input.classList.remove('is--error');
	});
	if (input.type == 'radio') {
		input.addEventListener('click', () => {
			if (document.querySelectorAll(`[name=${input.dataset.name}]`).length) {
				document.querySelectorAll(`[name=${input.dataset.name}]`).forEach((radio) => {
					radio.classList.remove('is--error');
				});
			}
		});
	}
	input.addEventListener('focus', () => {});

}

function formValidation(form) {
	let isValid = true;
	const inputs = form.querySelectorAll('input, select, textarea, [type="radio"]');

	inputs.forEach((input) => {
		const {
			value,
			dataset
		} = input;
		input.classList.remove('is--error');

		if (dataset.required === 'true') {
			if (!value) {
				input.classList.add('is--error');
				isValid = false;
			}
			if (input.type == 'radio') {
				if (!document.querySelector(`[name=${input.dataset.name}]:checked`)) {
					document.querySelectorAll(`[name=${input.dataset.name}]`).forEach((radio) => {
						radio.classList.add('is--error');
					});
					if (selectToggle) {
						selectToggle.classList.add('is--error');
					}
				}
			}
		}
	});

	return isValid;
}

function checkValidationFormOnSubmit(formClassName) {
	const form = document.querySelector(formClassName);
	const inputs = form.querySelectorAll('input, select, [type="radio"]');
	const onSubmitHandler = (event) => {
		if (formValidation(form)) {
			return true;
		} else {
			//form.querySelector('.submit-button').value = "Kirim permintaan";
			return false;
		}
	};

	inputs.forEach((input) => {
		const isRequiredInput = input.getAttribute('data-required');
		if (isRequiredInput) {
			removeErrorClassOnInput(input);
		}
	});

	$(formClassName).submit(onSubmitHandler);
}

var forms = document.querySelectorAll('form[data-validation]');
if (forms.length) {
	forms.forEach((form) => {
		checkValidationFormOnSubmit(`#${form.getAttribute('id')}`);
		form.setAttribute('novalidate', '');
	})
}

//Open form inside modal
const insideModalTrigger = document.querySelectorAll('[data-modal-form-trigger]');

if (insideModalTrigger) {
	insideModalTrigger.forEach((trigger) => {
		trigger.addEventListener('click', () => {
			const scrollWrapper = trigger.closest('.sm__scroll-wrapper');
			const insideModalFormWrap = scrollWrapper.querySelector('.sm__inside-modal-form-wrapper');

			if (!trigger.classList.contains('is--open')) {
				trigger.classList.add('is--open');
				insideModalFormWrap.style.height = insideModalFormWrap.scrollHeight + 'px';
				insideModalFormWrap.style.opacity = 1;

				setTimeout(function () {
					const topPos = insideModalFormWrap.getBoundingClientRect().top + scrollWrapper.scrollTop
					scrollWrapper.scrollTo({
						top: topPos, // scroll so that the element is at the top of the view
						behavior: 'smooth' // smooth scroll
					})
				}, 550)
			} else {
				trigger.classList.remove('is--open');
				insideModalFormWrap.style.height = 0;
				insideModalFormWrap.style.opacity = 0;
			}
		})
	})
}


//Fix scrollbar width remodal open/close
const bodyScrollControls = {
	scrollBarWidth: window.innerWidth - document.body.clientWidth,

	disable() {
		document.body.style.marginRight = `${this.scrollBarWidth}px`;
		document.querySelector('.w-nav').style.right = `${this.scrollBarWidth}px`;
		//if (document.querySelector('.cookie'))
		//document.querySelector('.cookie').style.marhinRight = `${this.scrollBarWidth}px`;
		document.body.style.paddingRight = null;
		document.body.style.overflowY = 'hidden';
	},
	enable() {
		document.body.style.marginRight = null;
		document.body.style.paddingRight = null;
		//if (document.querySelector('.cookie'))
		//document.querySelector('.cookie').style.marhinRight = 0;
		document.querySelector('.w-nav').style.right = 0;
		document.body.style.overflowY = null;
	},
};

//Загружаем Youtube Iframe API
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//Инициализируем плеер
var smYoutubePlayer;

function onYouTubeIframeAPIReady() {
	smYoutubePlayer = new YT.Player('sm__video-player', {
		height: '390',
		width: '640',
		videoId: 'u4QvQKWAVBQ',
		playerVars: {
			'playsinline': 1,
			'origin': window.location.host
		}
	});

	$('.sm__video-text-wrapper').on('click', function () {
		$(this).parent('.sm__video-wrapper').addClass('is--play');
		smYoutubePlayer.playVideo();
	})
}

$(document).on('opening', '.remodal', function (e) {
	bodyScrollControls.disable();
	const currentModal = $('.remodal.remodal-is-opening'),
		modalID = '#' + currentModal.data('remodal-id'),
		iframeInModal = currentModal.find('iframe'),
		modalWrapper = currentModal.closest('.remodal-is-opened'),
		scrollWrapper = currentModal.find('.sm__scroll-wrapper');
	lottieTriggers = currentModal.find('.sm__lottie-start-trigger'),
		phoneField = currentModal.find('.phone-input');

	scrollWrapper.animate({
		scrollTop: 0
	}, 0);

	if (phoneField.length) {
		resizePhoneSelectList(phoneField.get(0));
	}

	if (iframeInModal.length) {
		if (iframeInModal.data('src'))
			iframeInModal.attr('src', iframeInModal.data('src'));
	}

	if (lottieTriggers.length) {
		lottieTriggers.each(function () {
			$(this).trigger('click');
		})
	}
});

//Fix resize inSafari iOS
window.onresize = () => {
	setTimeout(function () {
		if (document.documentElement.classList.contains('remodal-is-locked')) {
			document.documentElement.classList.remove('remodal-is-locked');
			document.documentElement.classList.add('remodal-is-locked');
		}
	}, 300);
}

$(document).on('closing', '.remodal', function (e) {
	const currentModal = $('.remodal.remodal-is-closing'),
		modalID = '#' + currentModal.data('remodal-id'),
		iframeInModal = currentModal.find('iframe'),
		modalWrapper = currentModal.closest('.remodal-is-opened'),
		lottieTriggers = currentModal.find('.sm__lottie-start-trigger'),
		formInModal = currentModal.find('form'),
		youtubePlayerWrapper = currentModal.find('.sm__video-wrapper');


	if (youtubePlayerWrapper.length && smYoutubePlayer) {
		youtubePlayerWrapper.removeClass('is--play');
		setTimeout(function () {
			smYoutubePlayer.stopVideo();
		}, 500)
	}

	if (formInModal.length) {
		formInModal.find('[type="submit"]').val('Submit');
		$('.w-form-fail').hide();
		$('.w-form-done').hide();
		formInModal[0].reset();
		formInModal.show();
		formInModal.find('.is--error').each(function () {
			$(this).removeClass('is--error');
		});
	}

	if (iframeInModal.length) {
		if (iframeInModal.data('src'))
			iframeInModal.attr('src', '');
	}

	if ($('.sm__video-wrapper').length) {
		$('.sm__video-wrapper').removeClass('is--play');
	}

	if (lottieTriggers.length) {
		lottieTriggers.each(function () {
			$(this).trigger('click');
		})
	}
});

$(document).on('closed', '.remodal', function (e) {
	bodyScrollControls.enable();
});
