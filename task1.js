	const button = document.getElementById('btn');
	const ukrАlphabet  = [
	'а', 'б', 'в', 'г', 'ґ', 'д', 
	'е', 'є', 'ж', 'з', 'и', 'і',
	 'ї', 'й', 'к', 'л', 'м', 'н',
	  'о', 'п', 'р', 'с', 'т', 'у',
	   'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я'
	   ]

button.addEventListener('click', () => {
	const file = document.getElementById('file').files[0];

	const reader = new FileReader();
	reader.readAsText(file);

	const roundNumber = (num) => {
		return Math.round(parseFloat(num) * 100) / 100
	}

	reader.onload = () => {

		const text = reader.result;
		const textSize = text.trim().replace(/\s+/g, '').length;
		let textResult = '';

		let entropySum = 0;

		ukrАlphabet.map((letter) => {
			let counter = 0;
			for(let i = 0; i < text.length; i++){
				if(text[i].toLowerCase() === letter){
					counter++;
				}
			}
			const probability = roundNumber(counter/textSize);
			let entropia = 0;
			for(let i = 0; i < 33; i++){
				entropia += probability * (Math.log(1/probability) / Math.log(2))
			}
			entropySum += entropia || 0;
			textResult+=`${letter} - ${probability} entropia = ${roundNumber(entropia) || 0} bit, \r\n`;
		})
		console.log(textResult)
		console.log(`original file size - ${file.size*8} bit`);
		console.log(`information size - ${roundNumber(entropySum/33*textSize)} bit`)
		const stat = document.getElementById('statistics');
		stat.textContent = textResult;
	}
	reader.onerror = () => {
		console.log(reader.error);
	}
})

