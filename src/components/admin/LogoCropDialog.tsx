import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crop as CropIcon, Check, X, Move } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface LogoCropDialogProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  originalFileName: string;
}

export default function LogoCropDialog({
  open,
  onClose,
  imageSrc,
  onCropComplete,
  originalFileName,
}: LogoCropDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropSize, setCropSize] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image when dialog opens
  useEffect(() => {
    if (open && imageSrc) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageDimensions({ width: img.width, height: img.height });
        const minDim = Math.min(img.width, img.height);
        setCropSize(minDim);
        setOffsetX(Math.floor((img.width - minDim) / 2));
        setOffsetY(Math.floor((img.height - minDim) / 2));
        setImageLoaded(true);
      };
      img.src = imageSrc;
    } else {
      setImageLoaded(false);
    }
  }, [open, imageSrc]);

  // Draw preview on canvas
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previewSize = 200;
    canvas.width = previewSize;
    canvas.height = previewSize;

    ctx.clearRect(0, 0, previewSize, previewSize);
    ctx.drawImage(
      imageRef.current,
      offsetX,
      offsetY,
      cropSize,
      cropSize,
      0,
      0,
      previewSize,
      previewSize
    );
  }, [imageLoaded, cropSize, offsetX, offsetY]);

  const maxCropSize = Math.min(imageDimensions.width, imageDimensions.height);
  const maxOffsetX = Math.max(0, imageDimensions.width - cropSize);
  const maxOffsetY = Math.max(0, imageDimensions.height - cropSize);

  const handleCropConfirm = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output at 512x512 for good quality
    const outputSize = 512;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.drawImage(
      imageRef.current,
      offsetX,
      offsetY,
      cropSize,
      cropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = originalFileName.replace(/\.[^/.]+$/, '');
        const file = new File([blob], `${baseName}-cropped.png`, {
          type: 'image/png',
        });
        onCropComplete(file);
        onClose();
      },
      'image/png',
      1
    );
  }, [cropSize, offsetX, offsetY, originalFileName, onCropComplete, onClose]);

  const handleClose = () => {
    setImageLoaded(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="h-5 w-5" />
            Crop Logo to Square
          </DialogTitle>
          <DialogDescription>
            Adjust the crop area using the sliders below. The result will be a square image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Canvas */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-dashed border-primary/50 rounded-lg bg-muted/30"
                style={{ width: 200, height: 200 }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              )}
            </div>
          </div>

          {imageLoaded && (
            <div className="space-y-4">
              {/* Crop Size Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CropIcon className="h-4 w-4" />
                  Crop Size: {cropSize}px
                </label>
                <Slider
                  value={[cropSize]}
                  min={50}
                  max={maxCropSize}
                  step={1}
                  onValueChange={([value]) => {
                    setCropSize(value);
                    // Adjust offsets if needed
                    if (offsetX + value > imageDimensions.width) {
                      setOffsetX(Math.max(0, imageDimensions.width - value));
                    }
                    if (offsetY + value > imageDimensions.height) {
                      setOffsetY(Math.max(0, imageDimensions.height - value));
                    }
                  }}
                />
              </div>

              {/* Horizontal Position Slider */}
              {maxOffsetX > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Move className="h-4 w-4" />
                    Horizontal Position
                  </label>
                  <Slider
                    value={[offsetX]}
                    min={0}
                    max={maxOffsetX}
                    step={1}
                    onValueChange={([value]) => setOffsetX(value)}
                  />
                </div>
              )}

              {/* Vertical Position Slider */}
              {maxOffsetY > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Move className="h-4 w-4 rotate-90" />
                    Vertical Position
                  </label>
                  <Slider
                    value={[offsetY]}
                    min={0}
                    max={maxOffsetY}
                    step={1}
                    onValueChange={([value]) => setOffsetY(value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCropConfirm} disabled={!imageLoaded}>
            <Check className="h-4 w-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
