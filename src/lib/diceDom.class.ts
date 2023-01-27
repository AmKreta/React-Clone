import Fiber from "./fiber";
import { DICE_ELEMENT, FIBER } from "./types/types";

class DiceDom {
  nextUnitOfWork:FIBER | null;
  rootFiber:FIBER | null;
  currentRootFiber:FIBER | null;
  fibersToDelete:FIBER[];

  constructor() {
    this.nextUnitOfWork=null;
    this.rootFiber=null;
    this.currentRootFiber=null;
    this.fibersToDelete=[];
  }

  render(element: DICE_ELEMENT, container: HTMLElement) {
    this.rootFiber=this.nextUnitOfWork={
      dom:container,
      props:{
        children:[element]
      },
      alternate:this.currentRootFiber
    } as FIBER;
    requestIdleCallback(this.worker);
  }

  performUnitOfWork(fiber:FIBER):FIBER | null{
    this.reconcileChildren(fiber);
    if(fiber.child) return fiber.child;
    let nextFiber=fiber;
    while(nextFiber){
      if(nextFiber.sibling) return nextFiber.sibling;
      nextFiber=nextFiber.parent;
    }
    return null;
  }

  worker=(deadline:IdleDeadline)=>{
    let shouldYeild=true;
    while(this.nextUnitOfWork && shouldYeild){
      this.nextUnitOfWork=this.performUnitOfWork(this.nextUnitOfWork);
      if(!this.nextUnitOfWork && this.rootFiber) this.comitRoot();
      if(deadline.timeRemaining()<1)shouldYeild=false;
    }
    requestIdleCallback(this.worker);
  }

  comitRoot(){
    this.fibersToDelete.forEach(this.comitWork)
    this.currentRootFiber=this.rootFiber;
    this.comitWork(this.rootFiber.child);
    this.rootFiber=null;
  }

  comitWork=(fiber:FIBER | null)=>{
    if(!fiber) return;
    const domfiberDomParent=this.getDomFiberParent(fiber.parent);
    if(fiber.effectTag==='PLACEMENT' && fiber.dom){
      domfiberDomParent.dom.appendChild(fiber.dom);
      this.deleteDom(fiber.alternate, domfiberDomParent);
    }
    if(fiber.effectTag==='UPDATE') this.updateDom(fiber);
    if(fiber.effectTag==='DELETION') this.deleteDom(fiber, domfiberDomParent);
    this.comitWork(fiber.child);
    this.comitWork(fiber.sibling);
  }

  reconcileChildren(fiber:FIBER){
    let oldFiber=fiber.alternate?.child;
    let children=fiber.type instanceof Function
      ?[fiber.type(fiber.props)]
      :fiber.props.children;
    let prevFiber:FIBER=null;
    for(let i=0;i<children.length || oldFiber;i++, oldFiber=oldFiber?.sibling){
      let child=children[i];
      const isSameType=  oldFiber && child && child.type===oldFiber?.type;
      let newFiber:FIBER |null=null;
      if(isSameType){
        // type of child didn't changed
        // and setting alternate
        newFiber= new Fiber(child, oldFiber);
        newFiber.parent=fiber;
        newFiber.effectTag='UPDATE';
      }
      else{
        // type of child has been changed
        if(child){
          // child has been deleted
          newFiber= new Fiber(child);
          newFiber.effectTag='PLACEMENT';
          newFiber.parent=fiber;
        }
        if(oldFiber){
          // a new child is created
          oldFiber.effectTag='DELETION';
          this.fibersToDelete.push(oldFiber);
        }
      }
      if(i==0) fiber.child=newFiber;
      else if(prevFiber) prevFiber.sibling=newFiber;
      prevFiber=newFiber;
    }
  }

  updateDom(fiber:FIBER){
    const oldProps=fiber.alternate.props;
    const newProps=fiber.props;

    for(let propName in oldProps){
      // removing old props
      if(propName==='children' || !(propName in newProps)) return;
      if(propName.startsWith('on') && (oldProps[propName] instanceof Function)){
        const eventName=propName.slice(2).toLowerCase();
        fiber.dom.removeEventListener?.(eventName, oldProps[propName]);
      }
      else (fiber.dom as HTMLElement).removeAttribute?.(propName)
    }

    for(let propName in newProps){
      // adding new props which are not already added
      if(propName==='children' || (propName in oldProps)) return;
      if(propName.startsWith('on') && (newProps[propName] instanceof Function)){
        const eventName=propName.slice(2).toLowerCase();
        fiber.dom.addEventListener?.(eventName, oldProps[propName]);
      }
      else (fiber.dom as HTMLElement).setAttribute?.(propName, newProps[propName])
    }
  }

  deleteDom(fiber:FIBER, domfiberParent:FIBER){
    if(!fiber?.dom) return;
    // remove from dom and remove event listeners
    for(let propName in fiber.props){
      if(propName==='children') return;
      if(propName.startsWith('on') && (fiber.props[propName] instanceof Function)){
        const eventName=propName.slice(2).toLowerCase();
        fiber.dom.removeEventListener?.(eventName, fiber.props[propName]);
      }
    }
    domfiberParent.dom?.removeChild(fiber.dom);
  }

  getDomFiberParent(fiber:FIBER | null){
    while(!fiber.dom) fiber=fiber.parent;
    return fiber;
  }
}

export default DiceDom;
