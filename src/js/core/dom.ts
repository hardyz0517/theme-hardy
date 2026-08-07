export type FeatureInitializer = () => void;

export const query = <ElementType extends Element>(
  selector: string,
  root: ParentNode = document,
): ElementType | null => root.querySelector<ElementType>(selector);

export const queryAll = <ElementType extends Element>(
  selector: string,
  root: ParentNode = document,
): ElementType[] => Array.from(root.querySelectorAll<ElementType>(selector));

export const isHTMLElement = (value: Element | null): value is HTMLElement =>
  value instanceof HTMLElement;

export const runFeatures = (
  features: Array<[name: string, initialize: FeatureInitializer]>,
): void => {
  for (const [name, initialize] of features) {
    try {
      initialize();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`[Hardy] ${name} failed to initialize`, error);
      }
    }
  }
};
