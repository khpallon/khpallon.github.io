
// Sends login information to signin endpoint when submit button is pressed
addEventListener('submit', (event) => {
   event.preventDefault();

let username = document.getElementById('username').value;
let password = document.getElementById('password').value;
let auth = btoa(`${username}:${password}`);


fetch('https://01.kood.tech/api/auth/signin', {
  method: "POST",
	headers: {
    'Content-Type': 'application/json',
		'Authorization': `Basic ${auth}`
	}
}).then(function (response) {
	if (response.ok) {
		return response.json();
	}
	throw response;
}).then(function (data) {
	bearer(data)
}).catch(function (error) {
	document.getElementById("error").style.display = 'block'
});
});

// sends query data and jwt token to graphql endpoint

function bearer(data){

	const queries = {
		barChartQuery: `{
				transaction(
				  where: {
					_or: [
					  { type: { _eq: "skill_html" } },
					  { type: { _eq: "skill_go" } },
					  { type: { _eq: "skill_unix" } },
					  { type: { _eq: "skill_docker" } },
					  { type: { _eq: "skill_css" } },
					  { type: { _eq: "skill_js" } },
					]
					path: { _regex: "div-0" }
					_and: { _not: { path: { _regex: "piscine-js" } } }
				  }
				  order_by: { type: asc , amount: desc }
				) {
				  type
				  amount
				}
		  }
		  `,
		lineGraphQuery: `{
			transaction ( where: {
			  type:{_eq: "xp"}
			  path: { _regex: "div-0" }
				  _and: { _not: { path: { _regex: "piscine-js" } } }
			  createdAt: { 
					_gte: "2023-01-01T00:00:00Z", 
					_lt: "2024-01-01T00:00:00Z" 
				  }
			}
			order_by: { createdAt: asc })
			{
			  path
			  amount
			  createdAt
			}
		  }`,
		profileQuery: `
		{		
			user {
				id
				login
			auditRatio
			attrs
			  }
		  transaction ( where: {
				  type:{_eq: "xp"}
				  path: { _regex: "div-0" }
					  _and: { _not: { path: { _regex: "piscine-js" } } }
		  })
		  {
			amount
		  }
			}`,
		levelQuery: `
		{		
			transaction ( where: {
					type:{_eq: "level"}
					path: { _regex: "div-0" }
						_and: { _not: { path: { _regex: "piscine-js" } } }
			}
			order_by:{amount: desc})
			{
			  amount
			}
			  }
		`
	}

allQuery = [
	{query: queries.barChartQuery},
	{query: queries.lineGraphQuery},
	{query: queries.profileQuery},
	{query: queries.levelQuery}
]



  fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
    method: "POST",
	headers: {
    'Content-Type': 'application/json',
		'Authorization': `Bearer ${data}`
	},
	body: JSON.stringify( allQuery )
}).then(function (response) {
	if (response.ok) {
		return response.json();
	}
	throw response;
}).then(function (data) {
	graph(data);
}).catch(function (error) {
	console.warn(error);
});

}

var xpSum = 0



function graph(data) {

document.getElementById('myform').style.display = 'none'
document.getElementById("error").style.display = 'none'

document.getElementById('btnRefresh').style.display = 'inline-block'


for ( let i = 0; i < data[2].data.transaction.length; i++ ){
xpSum += data[2].data.transaction[i].amount
}

xpSum = Math.round(xpSum / 1000)

let profile = htmlToElement(`<div>
<h2>Welcome ${data[2].data.user[0].login}</h2>
<h3>XP: ${xpSum} Kb</h3>
<h3>Audit Ratio: ${Math.round(data[2].data.user[0].auditRatio * 10) / 10}</h3>
<h3>Level: ${data[3].data.transaction[0].amount}</h3>
</div>
`)

document.getElementById('profile').appendChild(profile)

const progSkills = barChartValues(data[0].data.transaction)
const xpProgress = lineGraphValues(data[1].data.transaction)

barChart(progSkills)
lineGraph(xpProgress)





}

// narrows down the information recieved from the query

function lineGraphValues(data){

	data.forEach(obj => {
		var date = new Date(obj.createdAt)
		obj.createdAt = (date.getMonth() + 1)

		obj.path = obj.path.replace("/johvi/div-01/", "")
	})

	return(data)	
}

function barChartValues(data){

	let highestValues = {}
	 data.forEach(obj => {
		
		let property = obj["type"]
		let value = obj["amount"]
	
		if (!highestValues.hasOwnProperty(property)){
			highestValues[property] = value
		}
	
	 })
	
	return highestValues
	
	}

// turns a string containing html to a variable

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); 
    template.innerHTML = html;
    return template.content.firstChild;
}




function lineGraph(xpProgress){

	var graph = `
	<svg width="1860" height="740" id="graph" aria-labelledby="title" role="img">     
	<g class="grid y-grid">
				  <line stroke="black" x1="40" x2="1840px" y1="655" y2="655"></line>
				  <line stroke="black" x1="40" x2="40" y1="0" y2="655"></line>
				</g>
	`
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

for (var month = 1; month < 13; month++){

	graph += `<line stroke="black" x1="${40+(150*month)}" x2="${40+(150*month)}" y1="655" y2="645"></line>
	<text x="${25+(150*month)}" y="675">${months[month-1]}</text>
	`
}

for (var kb = 1; kb < 8; kb++){
	graph += `<line stroke="black" x1="40" x2="60" y1="${655 -(100 * kb)}" y2="${655 -(100 * kb)}"></line>
	<text x="65" y="${660 -(100 * kb)}">${300*kb} Kb</text>`
}

graph += `<polyline
fill="none"
stroke="#555"
stroke-width="2"
points="40,655 `

var currentMonth = 1
var monthXp = 0
var currentY = 655

for (var points = 0; points < xpProgress.length; points++){


	if (points+1 == xpProgress.length){
		monthXp += xpProgress[points].amount 
		currentMonth = xpProgress[points].createdAt
		var lastAccess = true
	}
	
	if (currentMonth != xpProgress[points].createdAt || lastAccess == true){
	currentY = Math.round(currentY - Math.round((monthXp / 1000) / 3))
	graph += `${40 + (150 * currentMonth)}, ${currentY} `
	monthXp = xpProgress[points].amount
	currentMonth = xpProgress[points].createdAt
	} else {
		monthXp += xpProgress[points].amount 
	}

	}


	graph += `"/>
	<line stroke="gray" stroke-dasharray="5, 10" x1="40" x2="${40 + (150 * currentMonth)}" y1="${currentY}" y2="${currentY}"></line>
	<line stroke="gray" stroke-dasharray="5, 10" x1="${40 + (150 * currentMonth)}" x2="${40 + (150 * currentMonth)}" y1="${currentY}" y2="655"></line>
	<text x="${40 + (150 * currentMonth)}" y="${currentY}" font-size="1em">${xpSum} Kb</text>
	<text x="700" y="730" font-size="2em">XP GAINED PER MONTH IN 2023</text>
	</svg>`

	
	document.getElementById("lineGraph").appendChild(htmlToElement(graph))

	document.getElementById('chart').style.display = 'flex'


}


function barChart(progSkills){
	for ( let i = 0; i < 6; i++){

		let skill = Object.keys(progSkills)[i].replace('skill_', '').toUpperCase()
	
		let bar = htmlToElement(`
		<svg class="bar" height="80"  >
		<g  visibility="visible" >
			  <rect x="40" width="1" height="50" style="fill: #555;">
			  <animate attributeName="width" from="1" to="${(Object.values(progSkills)[i] / 100) * 1820}" dur="1.5s" fill="freeze" />
			  </rect>
			  <text opacity="0" font-size="20px" font-weight="bold" style="fill: black;" x="45" y="25" dy=".35em">${skill}
			  <animate attributeName="opacity" from="0" to="1" dur="2s" begin="1s" fill="freeze" />	
			  </text>	  	  
			  <text opacity="0" font-size="20px" font-weight="bold" style="fill: black;" x="${((Object.values(progSkills)[i] / 100) * 1820)}" y="25" dy=".35em">${Object.values(progSkills)[i]}%
			  <animate attributeName="opacity" from="0" to="1" dur="3s" begin="1s" fill="freeze" />
			  </text>
			  </g>
			</svg>
		`)	
		document.getElementById("chart").appendChild(bar)
	
	}
	
	var graph = `
	<svg id="graph" aria-labelledby="title" role="img">     
				<g class="grid y-grid">
				  <line stroke="black" x1="40" x2="1860px" y1="22" y2="22"></line>
				</g>
			  
			  `
	
	for( let point = 0; point<11; point++){
		var node = `
		<line stroke="black" x1="${(182*point)+39}"  x2="${(182*point)+39}" y2="22"></line>
				<text x="${(182*point)+29}" y="50">${((182*point)/ 1820) * 100}%</text>
				`
				graph+=node
	
	}
	graph+=`<text x="820" y="100" font-size="2em">SKILL PROGRESS</text>
	</svg>`
	
	document.getElementById("chart").appendChild(htmlToElement(graph))
	
	document.getElementById('chart').style.display = 'flex'
	document.getElementById('lineGraph').style.display = 'flex'


}