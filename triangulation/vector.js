"use strict";

class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(val){
        return new Vector(this.x + val.x, this.y + val.y)
    }

    addTo(val){
        this.x += val.x;
        this.y += val.y;
    }

    sub(val){
        return new Vector(this.x - val.x, this.y - val.y)
    }

    subFrom(val){
        this.x -= val.x;
        this.y -= val.y;
    }

    mult(n){
        return new Vector(this.x * n, this.y * n);
    }

    multTo(n){
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n){
        return new Vector(this.x / n, this.y / n);
    }

    setAngle(angle){
        let length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    setLength(length) {
        var angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle(){
        return Math.atan2(this.y, this.x);
    }

    getLength(){
        return Math.hypot(this.x, this.y);
    }

    getLengthSq(){
        return this.x * this.x + this.y * this.y;
    }

    distanceTo(val){
        return this.sub(v).getLength();
    }

    copy(){
        return new Vector(this.x, this.y);
    }

    equals(val){
        return this.x == val.x && this.y == val.y; 
    }

    rotate(angle){
        return new Vector(this.x * Math.cos(angle) - this.y *  Math.sin(angle),
                        this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }
}

