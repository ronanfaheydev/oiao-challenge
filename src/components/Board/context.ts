import { createContext } from "react";

const BoardContext = createContext({
	updateNode: (id: string, data: any) => {},
});

export default BoardContext;
