export function normalizeArray(arr:any[]){
    return arr.reduce((prev, current)=>{
        if(Array.isArray(current)){
            let result=normalizeArray(current);
            for(let res of result)
                prev.push(res);
        }
        else prev.push(current);
        return prev;
    },[]);
}