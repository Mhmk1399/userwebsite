import { AnimationConfig, animationService } from './animationService';

export interface AnimationEffect {
  type: 'hover' | 'click' | 'scroll' | 'load';
  animation: AnimationConfig & {
    intensity?: 'light' | 'normal' | 'strong';
  };
  trigger?: {
    threshold?: number;
    delay?: number;
  };
}

export class EffectService {
  private effectTypes = ['hover', 'click', 'scroll', 'load'];
  private activeEffects = new Map<string, AnimationEffect>();

  getEffectTypes(): string[] {
    return this.effectTypes;
  }

  getAnimationTypes(): string[] {
    return animationService.getAnimationTypes();
  }

  getDefaultEffectConfig(type: 'hover' | 'click' | 'scroll' | 'load', animationType: string): AnimationEffect {
    const baseConfig = animationService.getDefaultConfig(animationType);
    
    return {
      type,
      animation: {
        ...baseConfig,
        intensity: 'normal'
      },
      trigger: type === 'scroll' ? { threshold: 0.5, delay: 0 } : undefined
    };
  }

  validateEffect(effect: AnimationEffect): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.effectTypes.includes(effect.type)) {
      errors.push(`Invalid effect type: ${effect.type}`);
    }

    if (!effect.animation) {
      errors.push('Animation configuration is required');
    } else {
      const animationValid = animationService.validateConfig(effect.animation);
      if (!animationValid) {
        errors.push('Invalid animation configuration');
      }
    }

    if (effect.type === 'scroll' && effect.trigger) {
      if (effect.trigger.threshold && (effect.trigger.threshold < 0 || effect.trigger.threshold > 1)) {
        errors.push('Scroll threshold must be between 0 and 1');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  generateEffectCSS(effect: AnimationEffect, elementId: string): string {
    const { type, animation } = effect;
    const animationName = `${animation.type}-${elementId}`;
    
    // Generate keyframes with intensity
    const keyframes = this.generateIntensityKeyframes(animation.type, animation.intensity || 'normal');
    
    let css = `
      @keyframes ${animationName} {
        ${keyframes}
      }
    `;

    // Generate trigger-specific CSS
    switch (type) {
      case 'hover':
        css += `
          .effect-${elementId}:hover {
            animation: ${animationName} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'};
            animation-fill-mode: both;
          }
        `;
        break;
      
      case 'click':
        css += `
          .effect-${elementId}.clicked {
            animation: ${animationName} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'};
            animation-fill-mode: both;
          }
        `;
        break;
      
      case 'scroll':
        css += `
          .effect-${elementId}.in-view {
            animation: ${animationName} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'};
            animation-fill-mode: both;
          }
        `;
        break;
      
      case 'load':
        css += `
          .effect-${elementId} {
            animation: ${animationName} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'};
            animation-fill-mode: both;
          }
        `;
        break;
    }

    return css;
  }

  private generateIntensityKeyframes(type: string, intensity: 'light' | 'normal' | 'strong'): string {
    const intensityMultiplier = {
      light: 0.5,
      normal: 1,
      strong: 1.5
    }[intensity];

    const keyframeGenerators: Record<string, (intensity: number) => string> = {
      pulse: (i) => `
        0%, 100% { 
          opacity: 1;
          filter: brightness(1);
        }
        50% { 
          opacity: ${Math.max(0.3, 1 - (0.4 * i))};
          filter: brightness(${1 + (0.3 * i)});
        }
      `,
      glow: (i) => `
        0%, 100% { 
          filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
        }
        50% { 
          filter: brightness(${1 + (0.2 * i)}) drop-shadow(0 0 ${8 * i}px rgba(255, 255, 255, ${0.6 * i}));
        }
      `,
      brightness: (i) => `
        0%, 100% { 
          filter: brightness(1);
        }
        50% { 
          filter: brightness(${1 + (0.4 * i)});
        }
      `,
      blur: (i) => `
        0%, 100% { 
          filter: blur(0px);
        }
        50% { 
          filter: blur(${2 * i}px);
        }
      `,
      saturate: (i) => `
        0%, 100% { 
          filter: saturate(1);
        }
        50% { 
          filter: saturate(${1 + (0.8 * i)});
        }
      `,
      contrast: (i) => `
        0%, 100% { 
          filter: contrast(1);
        }
        50% { 
          filter: contrast(${1 + (0.5 * i)});
        }
      `,
      opacity: (i) => `
        0% { 
          opacity: 1;
        }
        50% { 
          opacity: ${Math.max(0.2, 1 - (0.6 * i))};
        }
        100% { 
          opacity: 1;
        }
      `,
      shadow: (i) => `
        0%, 100% { 
          filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
        }
        50% { 
          filter: drop-shadow(0 ${4 * i}px ${8 * i}px rgba(0, 0, 0, ${0.3 * i}));
        }
      `
    };

    return keyframeGenerators[type] ? keyframeGenerators[type](intensityMultiplier) : keyframeGenerators.pulse(intensityMultiplier);
  }

  applyEffect(elementId: string, effect: AnimationEffect): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Store effect for cleanup
    this.activeEffects.set(elementId, effect);

    // Generate and inject CSS
    const css = this.generateEffectCSS(effect, elementId);
    animationService.injectCSS(css, `effect-${elementId}`);

    // Add effect class
    element.classList.add(`effect-${elementId}`);

    // Set up event listeners based on effect type
    this.setupEventListeners(element, effect, elementId);
  }

  private setupEventListeners(element: HTMLElement, effect: AnimationEffect, elementId: string): void {
    switch (effect.type) {
      case 'click':
        element.addEventListener('click', () => {
          element.classList.add('clicked');
          const duration = parseFloat(effect.animation.duration.replace('s', '')) * 1000;
          const delay = parseFloat((effect.animation.delay || '0s').replace('s', '')) * 1000;
          
          setTimeout(() => {
            element.classList.remove('clicked');
          }, duration + delay);
        });
        break;

      case 'scroll':
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const threshold = effect.trigger?.threshold || 0.5;
                if (entry.intersectionRatio >= threshold) {
                  element.classList.add('in-view');
                }
              } else {
                element.classList.remove('in-view');
              }
            });
          },
          { threshold: effect.trigger?.threshold || 0.5 }
        );
        observer.observe(element);
        break;

      case 'load':
        // Animation triggers immediately when applied
        setTimeout(() => {
          element.classList.add('loaded');
        }, effect.trigger?.delay || 0);
        break;

      // hover is handled by CSS, no JS needed
    }
  }

  removeEffect(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      // Remove all effect classes
      element.classList.remove(`effect-${elementId}`, 'clicked', 'in-view', 'loaded');
      
      // Remove event listeners by cloning the element
      const newElement = element.cloneNode(true);
      element.parentNode?.replaceChild(newElement, element);
    }

    // Remove CSS
    animationService.removeCSS(`effect-${elementId}`);
    
    // Remove from active effects
    this.activeEffects.delete(elementId);
  }

  updateEffect(elementId: string, effect: AnimationEffect): void {
    this.removeEffect(elementId);
    this.applyEffect(elementId, effect);
  }

  getActiveEffect(elementId: string): AnimationEffect | undefined {
    return this.activeEffects.get(elementId);
  }

  getAllActiveEffects(): Map<string, AnimationEffect> {
    return new Map(this.activeEffects);
  }

  // Batch operations for performance
  applyMultipleEffects(effects: Array<{ elementId: string; effect: AnimationEffect }>): void {
    const cssChunks: string[] = [];
    
    effects.forEach(({ elementId, effect }) => {
      const css = this.generateEffectCSS(effect, elementId);
      cssChunks.push(css);
      this.activeEffects.set(elementId, effect);
    });

    // Inject all CSS at once
    const combinedCSS = cssChunks.join('\n');
    animationService.injectCSS(combinedCSS, 'batch-effects');

    // Apply classes and event listeners
    effects.forEach(({ elementId, effect }) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.classList.add(`effect-${elementId}`);
        this.setupEventListeners(element, effect, elementId);
      }
    });
  }

  removeMultipleEffects(elementIds: string[]): void {
    elementIds.forEach(elementId => {
      this.removeEffect(elementId);
    });
  }

  // Performance optimization
  optimizeEffects(): void {
    // Remove unused CSS
    const activeCSSIds = Array.from(this.activeEffects.keys()).map(id => `effect-${id}`);
    const allStyleElements = document.querySelectorAll('[data-animation-id]');
    
    allStyleElements.forEach(styleElement => {
      const id = styleElement.getAttribute('data-animation-id');
      if (id && !activeCSSIds.includes(id) && id !== 'batch-effects') {
        animationService.removeCSS(id);
      }
    });
  }

  // Accessibility helpers
  respectReducedMotion(): void {
    if (typeof window === 'undefined') return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Disable all animations
      const disableCSS = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      animationService.injectCSS(disableCSS, 'reduced-motion');
    }
  }

  // Debug helpers
  getPerformanceMetrics(): {
    activeEffects: number;
    injectedStyles: number;
    memoryUsage: number;
  } {
    const animationMetrics = animationService.getMetrics();
    
    return {
      activeEffects: this.activeEffects.size,
      injectedStyles: animationMetrics.injectedStyles,
      memoryUsage: JSON.stringify(Array.from(this.activeEffects.entries())).length
    };
  }

  // Cleanup
  cleanup(): void {
    this.activeEffects.clear();
    animationService.cleanup();
  }

  // Preset configurations
  getPresetConfigs(): Record<string, AnimationEffect> {
    return {
      gentlePulse: {
        type: 'hover',
        animation: {
          type: 'pulse',
          duration: '1s',
          timing: 'ease-in-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'light'
        }
      },
      goldenGlow: {
        type: 'hover',
        animation: {
          type: 'glow',
          duration: '1.5s',
          timing: 'ease-in-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'normal'
        }
      },
      quickBrightness: {
        type: 'click',
        animation: {
          type: 'brightness',
          duration: '0.8s',
          timing: 'ease-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'normal'
        }
      },
      colorBoost: {
        type: 'hover',
        animation: {
          type: 'saturate',
          duration: '0.7s',
          timing: 'ease-in-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'strong'
        }
      },
      subtleShadow: {
        type: 'hover',
        animation: {
          type: 'shadow',
          duration: '0.6s',
          timing: 'ease-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'light'
        }
      },
      fadeInOnLoad: {
        type: 'load',
        animation: {
          type: 'opacity',
          duration: '1s',
          timing: 'ease-in',
          delay: '0.2s',
          iterationCount: '1',
          intensity: 'normal'
        }
      },
      scrollReveal: {
        type: 'scroll',
        animation: {
          type: 'brightness',
          duration: '0.8s',
          timing: 'ease-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'normal'
        },
        trigger: {
          threshold: 0.3,
          delay: 100
        }
      }
    };
  }

  applyPreset(elementId: string, presetName: string): void {
    const presets = this.getPresetConfigs();
    const preset = presets[presetName];
    
    if (preset) {
      this.applyEffect(elementId, preset);
    }
  }
}

export const effectService = new EffectService();

// Initialize reduced motion respect on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    effectService.respectReducedMotion();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    effectService.cleanup();
  });

  // Listen for reduced motion preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    effectService.respectReducedMotion();
  });
}
