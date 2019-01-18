declare const angular: any;
const mchale = angular.module('mchaleRecipes',[]);

//TODO: add more measurement conversions and types (volume vs weight etc.)
mchale.constant('measureConvert', {
	drops: { name: 'drops', base:1, teaspoon:0.01, tablespoon:0.0033, cup:0.0002,
		aliases:['drops'] 
	},
	teaspoon:{ name: 'teaspoon', base:1, drops:100, tablespoon:0.3333, cup:0.0208,
		aliases:['teaspoon', 'tsp'] 
	},
	tablespoon:{ name: 'tablespoon', base:1, drops:300, teaspoon:3, cup:0.0625,
		aliases:['tablespoon'] 
	},
	cup:{ name: 'cup', base:1, drops:4800, teaspoon:48, tablespoon:16,
		aliases:['cup'] 
	}	
});
	
mchale.controller('mchaleCtrl', ['measureConvert','$http',function( measureConvert, $http ){

	const ctrl = this;
	let visibleIndex;

	const updateSavedRecipes = function( library ){

		sessionStorage.setItem('recipes', JSON.stringify(library));

		ctrl.myRecipes = library;
		ctrl.hasRecipes = Object.keys(ctrl.myRecipes).length > -1;

	}

	const addIngredientMeasurement = function(ingredient){
		const {text, quantity} = ingredient;
		const textWithoutQuantity = text.slice(text.indexOf(quantity)+1);
		const measurementName = textWithoutQuantity.split(" ").find(function(term){
			return term !== "";
		});
		//need a measurement conversion generator service?
		measureConvert[measurementName] = {
			name: measurementName,
			base: 1,
			aliases: [measurementName]
		}
		return measurementName;
	}

	const getFloatFromTextFraction = function (text){
		const [textFraction = null] = /[1-9][0-9]*\/[1-9][0-9]*/g.exec(text) || [];
		const [dividend = null,divisor = null] = textFraction && textFraction.split('/') || [];
		return parseInt(dividend)/parseInt(divisor);
	}

	const getIngredientQuantity = function(text){
		
		return getFloatFromTextFraction(text) || parseInt(text);
	}

	const getIngredientMeasure = function(ingredient){
		const existingMeasurement = Object.keys(measureConvert).find(function(measurement){
			return measureConvert[measurement].aliases.find(function(alias){
				return ingredient.text.indexOf(alias) !== -1;
			})
		})
		return existingMeasurement ? existingMeasurement : addIngredientMeasurement(ingredient);
	}

	const setupRecipe = function( {ingredients = []} ){
		// add ui program properties that can be inferred from data
		for( let ingredient of ingredients){
			let {food, text, quantity, measure, prevQuantity, prevMeas } = ingredient; 
			quantity = getIngredientQuantity(text);
			measure = getIngredientMeasure(ingredient);
			food = text.split(measure).pop();

			prevQuantity = quantity;
			prevMeas = measure;
		}
	}

	ctrl.searchResults = [];
	ctrl.myRecipes = JSON.parse(sessionStorage.getItem('recipes')) || {};
	ctrl.hasRecipes = Object.keys(ctrl.myRecipes).length > 0;

	ctrl.conversions = measureConvert;

	ctrl.recipe = Object.keys(ctrl.myRecipes)[0] ? ctrl.myRecipes[ Object.keys(ctrl.myRecipes)[0] ] : {};
	setupRecipe( ctrl.recipe );

	ctrl.convertRecipe = function(convertIngredient){

		const {ingredients} = ctrl.recipe;
		const multiplier = parseFloat(convertIngredient.quantity)/ convertIngredient.prevQuantity;
		for ( let ingredient of ingredients ){
			ingredient.quantity = Math.round((ingredient.prevQuantity * multiplier) * 100)/100;
			ingredient.prevQuantity = ingredient.quantity;
		}
	}
	
	ctrl.convertMeasurement = function( ingredient ){

		let {measure, quantity, prevMeas, prevQuantity} = ingredient;
		// When measurement unit changes for one ingredient, convert the quantity to match the new measurement
		quantity =  Math.round(
							(ctrl.conversions[ prevMeas ][ measure ] * quantity) 
							 * 100)/100;
		
		// Track values in 'prev' fields to use when next change triggered
		prevMeas = measure;
		prevQuantity = quantity;
		
	}

	ctrl.recipeSearch = function(searchInput){
		const edamam = 'https://api.edamam.com/search';
		const accessConfig = `&app_id=${config.app_id}&app_key=${config.app_key}`;
		const requestUrl = `${edamam}?q=${searchInput}${accessConfig}`;
		;

		$http({
		  method: 'GET',
		  url: requestUrl
		}).then(function successCallback(response) {
			ctrl.searchResults = response.data.hits;
		  }, function errorCallback(response) {
		  	console.log('error response ', response)
		  });
	}

	ctrl.addToMyRecipes = function(recipe, index){

		if (!index) index = visibleIndex || null;

		let recipeLib = JSON.parse(sessionStorage.getItem('recipes')) || {};
		recipeLib[recipe.uri] = recipe;

		if ( index )ctrl.searchResults.splice(index,1);

		updateSavedRecipes(recipeLib);
	};

	ctrl.deleteRecipe = function(recipe){

		let recipeLib = JSON.parse(sessionStorage.getItem('recipes')) || {};
		delete recipeLib[recipe.uri];
		updateSavedRecipes(recipeLib);

		ctrl.recipe = Object.keys(ctrl.myRecipes)[0] ? ctrl.myRecipes[ Object.keys(ctrl.myRecipes)[0] ] : {};
		setupRecipe( ctrl.recipe );
	}

	ctrl.selectRecipe = function(recipe, index) {

		if (index) visibleIndex = index;

		ctrl.recipe = recipe;
		setupRecipe( ctrl.recipe );
	}

}]);