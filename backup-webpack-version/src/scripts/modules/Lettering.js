class SplitIntoLetters {
	
	constructor(elements) {
		this.elList = document.querySelectorAll(elements);
		// convert nodelist into array
		this.elArr = [...this.elList];
		this.stringArr = [];
		this.letterArr = [];
		this.strings = "";
		this.letters = "";
		this.wrappedLetters = "";
		this.lettering();
	}

	lettering() {

		for (let i = 0; i < this.elArr.length; i++) {

			// add indexed based class to every element
			this.elArr[i].className += `  el--${i + 1}`;
			this.strings = this.elArr[i].innerHTML;

			// split words into letters
			//this.letters = this.strings.split('');
			this.letters = [...this.strings];

			// clean pushed elements from nested array 
			this.letterArr = [];
			for (let j = 0; j < this.letters.length; j++) {
				if (this.letters[j] != " ") {
					// wrap with span tag and  add class
					this.wrappedLetters = `<span class='char char-${j + 1}'> ${this.letters[j]} </span> `;
					this.letterArr.push(this.wrappedLetters);
				} else {
					this.wrappedLetters = `<span class='char char-space'> ${this.letters[j]} </span> `;
					this.letterArr.push(this.wrappedLetters);
				}

				// replace words with letters in the DOM		
				this.elArr[i].innerHTML = this.letterArr.join(' ');
			}

			this.stringArr.push(this.letterArr);

		}
	}

}

export default SplitIntoLetters;

