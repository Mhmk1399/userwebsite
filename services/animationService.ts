export interface AnimationConfig {
  type: string;
  duration: string;
  timing: string;
  delay?: string;
  iterationCount?: string;
  intensity?: 'light' | 'normal' | 'strong';
}

export class AnimationService {
  private animationTypes = ['pulse', 'glow', 'brightness', 'blur', 'saturate', 'contrast', 'opacity', 'shadow'];
  private timingFunctions = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0, 0, 0.2, 1)'];
  private injectedStyles = new Map<string, HTMLStyleElement>();

  getAnimationTypes(): string[] {
    return this.animationTypes;
  }

  getTimingFunctions(): string[] {
    return this.timingFunctions;
  }

  getDefaultConfig(type: string): AnimationConfig {
    const defaults: Record<string, AnimationConfig> = {
      pulse: {
        type: 'pulse',
        duration: '1s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      glow: {
        type: 'glow',
        duration: '1.5s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      brightness: {
        type: 'brightness',
        duration: '0.8s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      blur: {
        type: 'blur',
        duration: '0.6s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      saturate: {
        type: 'saturate',
        duration: '0.7s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      contrast: {
        type: 'contrast',
        duration: '0.5s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      opacity: {
        type: 'opacity',
        duration: '0.8s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      },
      shadow: {
        type: 'shadow',
        duration: '0.6s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1',
        intensity: 'normal'
      }
    };

    return defaults[type] || defaults.pulse;
  }

  validateConfig(config: AnimationConfig): boolean {
    // Validate animation type
    if (!this.animationTypes.includes(config.type)) {
      return false;
    }

    // Validate duration format
    if (!this.validateDuration(config.duration)) {
      return false;
    }

    // Validate timing function
    if (!this.timingFunctions.includes(config.timing)) {
      return false;
    }

    // Validate delay if provided
    if (config.delay && !this.validateDuration(config.delay)) {
      return false;
    }

    // Validate iteration count
    if (config.iterationCount && !this.validateIterationCount(config.iterationCount)) {
      return false;
    }

    return true;
  }

  private validateDuration(duration: string): boolean {
    const durationRegex = /^\d+(\.\d+)?(s|ms)$/;
    return durationRegex.test(duration);
  }

  private validateIterationCount(count: string): boolean {
    return count === 'infinite' || (!isNaN(Number(count)) && Number(count) > 0);
  }

  generateCSS(config: AnimationConfig, uniqueId?: string): string {
    const animationName = uniqueId ? `${config.type}-${uniqueId}` : config.type;
    const keyframes = this.getAnimationKeyframes(config.type, config.intensity);
    
    let css = `
      @keyframes ${animationName} {
        ${Object.entries(keyframes).map(([percentage, styles]) => `
          ${percentage} {
            ${Object.entries(styles).map(([property, value]) => `${property}: ${value};`).join('\n            ')}
          }
        `).join('\n        ')}
      }
      
      .animation-${uniqueId || config.type} {
        animation: ${animationName} ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
        animation-fill-mode: both;
      }
    `;

    return css;
  }

  getAnimationKeyframes(type: string, intensity: string = 'normal'): Record<string, Record<string, string>> {
    const intensityMultiplier = {
      light: 0.5,
      normal: 1,
      strong: 1.5
    }[intensity] || 1;

    const keyframes: Record<string, Record<string, Record<string, string>>> = {
      pulse: {
        '0%, 100%': { 
          opacity: '1',
          filter: 'brightness(1)'
        },
        '50%': { 
          opacity: `${Math.max(0.3, 1 - (0.4 * intensityMultiplier))}`,
          filter: `brightness(${1 + (0.3 * intensityMultiplier)})`
        }
      },
      glow: {
        '0%, 100%': { 
          filter: 'brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0))'
        },
        '50%': { 
          filter: `brightness(${1 + (0.2 * intensityMultiplier)}) drop-shadow(0 0 ${8 * intensityMultiplier}px rgba(255, 255, 255, 0.6))`
        }
      },
      brightness: {
        '0%, 100%': { 
          filter: 'brightness(1)'
        },
        '50%': { 
          filter: `brightness(${1 + (0.4 * intensityMultiplier)})`
        }
      },
      blur: {
        '0%, 100%': { 
          filter: 'blur(0px)'
        },
        '50%': { 
          filter: `blur(${2 * intensityMultiplier}px)`
        }
      },
      saturate: {
        '0%, 100%': { 
          filter: 'saturate(1)'
        },
        '50%': { 
          filter: `saturate(${1 + (0.8 * intensityMultiplier)})`
        }
      },
      contrast: {
        '0%, 100%': { 
          filter: 'contrast(1)'
        },
        '50%': { 
          filter: `contrast(${1 + (0.5 * intensityMultiplier)})`
        }
      },
      opacity: {
        '0%': { 
          opacity: '1'
        },
        '50%': { 
          opacity: `${Math.max(0.2, 1 - (0.6 * intensityMultiplier))}`
        },
        '100%': { 
          opacity: '1'
        }
      },
      shadow: {
        '0%, 100%': { 
          filter: 'drop-shadow(0 0 0px rgba(0, 0, 0, 0))'
        },
        '50%': { 
          filter: `drop-shadow(0 ${4 * intensityMultiplier}px ${8 * intensityMultiplier}px rgba(0, 0, 0, ${0.3 * intensityMultiplier}))`
        }
      }
    };

    return keyframes[type] || keyframes.pulse;
  }

  injectCSS(css: string, id: string): void {
    // Remove existing style if it exists
    this.removeCSS(id);

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    styleElement.setAttribute('data-animation-id', id);
    
    // Inject into head
    document.head.appendChild(styleElement);
    
    // Store reference for cleanup
    this.injectedStyles.set(id, styleElement);
  }

  removeCSS(id: string): void {
    const styleElement = this.injectedStyles.get(id);
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
      this.injectedStyles.delete(id);
    }
  }

  getAnimationPreview(type: string): string {
    const previews: Record<string, string> = {
      pulse: '🫀 پالس - تغییر شفافیت و روشنایی',
      glow: '✨ درخشش - افکت نور',
      brightness: '💡 روشنایی - تغییر نور',
      blur: '🌫️ تاری - افکت محو',
      saturate: '🎨 اشباع - تغییر رنگ',
      contrast: '🔳 کنتراست - تغییر تضاد',
      opacity: '👻 شفافیت - محو و ظاهر شدن',
      shadow: '🌑 سایه - افکت سایه'
    };

    return previews[type] || type;
  }

  // Cleanup all injected styles
  cleanup(): void {
    this.injectedStyles.forEach((styleElement, id) => {
      this.removeCSS(id);
    });
  }

  // Get performance metrics
  getMetrics(): { activeAnimations: number; injectedStyles: number } {
    return {
      activeAnimations: this.injectedStyles.size,
      injectedStyles: document.querySelectorAll('[data-animation-id]').length
    };
  }
}

export const animationService = new AnimationService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    animationService.cleanup();
  });
}
