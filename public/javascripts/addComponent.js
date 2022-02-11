function addComponent (base, component, coordinates, rotation) {
    component.position.x = coordinates.x;
    component.position.y = coordinates.y;
    component.position.z = coordinates.z;

    component.rotation.x = rotation.x;
    component.rotation.y = rotation.y;
    component.rotation.z = rotation.z;


    base.add(component);
}

export {addComponent};