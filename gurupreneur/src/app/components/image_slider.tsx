"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ImageSlider() {
  return (
    // memakai shadcn membungkus image
    <Card className="w-full h-120 overflow-hidden relative mx-auto">
      <CardContent className="p-0">
        <div>
          <img src="images/slide/img1.jpg" className="slide" />
          <img src="images/slide/img2.jpg" className="slide" />
          <img src="images/slide/img3.jpg" className="slide" />
        </div>
      </CardContent>
    </Card>
  );
}
