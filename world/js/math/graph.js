class Graph {
   constructor(points = [], segments = []) {
      this.points = points;
      this.segments = segments;
   }

   static load(info) {
      const points = info.points.map((i) => new Point(i.x, i.y));
      const segments = info.segments.map((i) => new Segment(
         points.find((p) => p.equals(i.p1)),
         points.find((p) => p.equals(i.p2)),
         i.oneWay
      ));
      return new Graph(points, segments);
   }

   hash() {
      return JSON.stringify(this);
   }

   addPoint(point) {
      this.points.push(point);
   }

   containsPoint(point) {
      return this.points.find((p) => p.equals(point));
   }

   tryAddPoint(point) {
      if (!this.containsPoint(point)) {
         this.addPoint(point);
         return true;
      }
      return false;
   }

   removePoint(point) {
      const segs = this.getSegmentsWithPoint(point);
      for (const seg of segs) {
         this.removeSegment(seg);
      }
      this.points.splice(this.points.indexOf(point), 1);
   }

   addSegment(seg) {
      this.segments.push(seg);
   }

   containsSegment(seg) {
      return this.segments.find((s) => s.equals(seg));
   }

   tryAddSegment(seg) {
      if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
         this.addSegment(seg);
         return true;
      }
      return false;
   }

   removeSegment(seg) {
      this.segments.splice(this.segments.indexOf(seg), 1);
   }

   getSegmentsWithPoint(point) {
      const segs = [];
      for (const seg of this.segments) {
         if (seg.includes(point)) {
            segs.push(seg);
         }
      }
      return segs;
   }
   getSegmentsLeavingFromPoint(point) {
      const segs = [];
      for (const seg of this.segments) {
         if(seg.oneWay){
            if(seg.p1.equals(point)){
               segs.push(seg);
            }
         }else {
            if (seg.includes(point)) {
               segs.push(seg);
            }
         }
      }
      return segs;
   }

   getShortestPath(start, end){

      for(const point of this.points){
         point.visited = false;
         point.distance = Number.MAX_SAFE_INTEGER;
      }
      let currentPoint = start;
      currentPoint.distance = 0;

      while(end.visited == false){
         const segs = this.getSegmentsLeavingFromPoint(currentPoint);
         for(const seg of segs){
            const otherPoint = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
            if(currentPoint.distance + seg.length() < otherPoint.distance){
               
               // path.push(otherPoint);
               otherPoint.distance = currentPoint.distance + seg.length();
               otherPoint.previous = currentPoint;
            }
         }
         currentPoint.visited = true;
         const unvisited = this.points.filter((p) => !p.visited);
         const dists = unvisited.map((p) => p.distance);
         currentPoint = unvisited.find((p)=> p.distance == Math.min(...dists));
      }
      const path = [];
      currentPoint = end;
      while(currentPoint){
         path.unshift(currentPoint);
         currentPoint = currentPoint.previous;
      }
      for(const point of this.points){
         delete point.visited;
         delete point.distance;
         delete point.previous;
      }

      return path;
   }

   dispose() {
      this.points.length = 0;
      this.segments.length = 0;
   }

   draw(ctx) {
      for (const seg of this.segments) {
         seg.draw(ctx);
      }

      for (const point of this.points) {
         point.draw(ctx);
      }
   }


}