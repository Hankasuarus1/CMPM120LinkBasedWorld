
let maxDogs = 3;
let dogBreeds = [];

class Start extends Scene {
    create() {
        console.log(this.engine.storyData);
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
       this.engine.gotoScene(Location,this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}


class Location extends Scene {
    create(key) {
        console.log("Current Place is " + key);
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(this.engine.storyData.Locations[key].Choices) { // TODO: check if the location has any Choices
            for(let choice of this.engine.storyData.Locations[key].Choices) { // TODO: loop over the location's Choices
                if (choice.Text != "Portal" )
                this.engine.addChoice(choice.Text,choice); // TODO: use the Text of the choice
                else if (choice.Text == "Portal" && dogBreeds.length == maxDogs){
                    this.engine.show("There is a strange portal following you around now");
                    this.engine.addChoice(choice.Text,choice);
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
                }
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
    if (choice) {
        let target = choice.Target;
        let nextData = this.engine.storyData.Locations[target];
        let sceneClass = nextData?.Breed ? Dog : Location;
        this.engine.show("&gt; " + choice.Text);
        this.engine.gotoScene(sceneClass, target);
    } else {
        this.engine.gotoScene(End);
    }
    }
}

class Dog extends Location {
    create(key) {
        super.create(key);
        let locationData = this.engine.storyData.Locations[key];
        let breed = locationData?.Breed;

        if (breed) {
            this.engine.addChoice("Pet the " + breed, {
                Text: "Pet the dog",
                Target: key,
                Petting: true,
                Breed: breed
            });
        }
    }
    handleChoice(choice) {
        if (choice?.Petting) {
            this.engine.show(`You pet the ${choice.Breed}. It looks delighted! 🐶`);
            if (dogBreeds.includes(choice.Breed) == false){
                dogBreeds.push(choice.Breed);
            }`  `
            this.engine.gotoScene(Dog, choice.Target);
        } else {
            super.handleChoice(choice);
        }
    }
}




class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}


Engine.load(Start, 'myStory.json');
