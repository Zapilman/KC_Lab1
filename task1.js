	const button = document.getElementById('btn');
	const encode = document.getElementById('encode');
	const ukrАlphabet  = [
	'а', 'б', 'в', 'г', 'ґ', 'д', 
	'е', 'є', 'ж', 'з', 'и', 'і',
	 'ї', 'й', 'к', 'л', 'м', 'н',
	  'о', 'п', 'р', 'с', 'т', 'у',
	   'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я'
	   ];
	const engAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const _utf8_encode = function (text) {
		const newText = text.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < newText.length; n++) {
			var c = newText.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

const encodeText = (input) => {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
}

const roundNumber = (num) => {
		return Math.round(parseFloat(num) * 100) / 100
	}

encode.addEventListener('click', () => {
	
	const file = document.getElementById('file').files[0];
	const reader = new FileReader();
	reader.readAsText(file);
	reader.onload = () => {
		const text = reader.result.replace(/\r\n/g,"");
		console.log(encodeText(text));
		console.log(btoa(_utf8_encode(text)));

		let entropySum = 0;
		const textSize = encodeText(text).trim().replace(/\s+/g, '').length;
		engAlphabet.map((letter) => {
			let counter = 0;
			for(let i = 0; i < encodeText(text).length; i++){
				if(encodeText(text)[i].toLowerCase() === letter){
					counter++;
				}
			}
			const probability = roundNumber(counter/textSize);
			let entropia = 0;
			for(let i = 0; i < 32; i++){
				entropia += probability * (Math.log(1/probability) / Math.log(2))

			}
			entropySum += entropia || 0;
		})

		console.log(`information size - ${roundNumber(entropySum/32*textSize)} bit`)
	}

});
button.addEventListener('click', () => {
	const file = document.getElementById('file').files[0];

	const reader = new FileReader();
	reader.readAsText(file);

	
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

