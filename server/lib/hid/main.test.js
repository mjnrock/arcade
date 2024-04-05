import ArcadeInput from "./ArcadeInput.js";

// Usage example:
const arcadeInput = new ArcadeInput({ vid: 121, pid: 6 });

// arcadeInput.addListener((state) => {
// 	console.clear();
// 	console.log("hi");
// 	console.log(state);
// });

arcadeInput.addListener(({ state, self }) => {
	console.clear();
	console.log(self.hasButton("K1"), self.hasButton("K2"), self.hasButton("K3"), self.hasButton("K4"));
});