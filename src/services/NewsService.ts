// NewsService - Single Responsibility: Handle news template and instance management
import { NewsTemplate, NewsInstance, NewsImpact } from '../models';

export class NewsService {
  // Default news templates that come with the application
  static getDefaultNewsTemplates(): NewsTemplate[] {
    return [
      {
        id: 'nfp',
        name: 'Non-Farm Payrolls',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'high',
        description: 'Monthly employment report showing job creation in the US'
      },
      {
        id: 'fomc',
        name: 'FOMC Rate Decision',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'high',
        description: 'Federal Reserve interest rate announcement'
      },
      {
        id: 'cpi',
        name: 'Consumer Price Index',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'high',
        description: 'Inflation measure showing price changes'
      },
      {
        id: 'gdp',
        name: 'GDP Report',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'medium',
        description: 'Quarterly economic growth report'
      },
      {
        id: 'retail_sales',
        name: 'Retail Sales',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'medium',
        description: 'Monthly consumer spending report'
      },
      {
        id: 'ecb_rate',
        name: 'ECB Rate Decision',
        type: 'news',
        countdownMinutes: 5,
        cooldownMinutes: 15,
        impact: 'high',
        description: 'European Central Bank interest rate decision'
      }
    ];
  }

  // Create a new news instance from a template
  static createNewsInstance(
    template: NewsTemplate, 
    scheduledTime: Date,
    overrides?: Partial<Pick<NewsInstance, 'name' | 'description'>>
  ): NewsInstance {
    return {
      id: `${template.id}_${Date.now()}`,
      templateId: template.id,
      name: overrides?.name || template.name,
      scheduledTime,
      impact: template.impact, // Use template impact, no override allowed
      isActive: true,
      description: overrides?.description || template.description
    };
  }

  // Get news instances that are currently active (within countdown or cooldown period)
  static getActiveNewsInstances(
    instances: NewsInstance[],
    templates: NewsTemplate[],
    currentTime: Date = new Date()
  ): Array<{ instance: NewsInstance; template: NewsTemplate; phase: 'countdown' | 'happening' | 'cooldown' }> {
    const activeInstances: Array<{ instance: NewsInstance; template: NewsTemplate; phase: 'countdown' | 'happening' | 'cooldown' }> = [];

    for (const instance of instances.filter(i => i.isActive)) {
      const template = templates.find(t => t.id === instance.templateId);
      if (!template) continue;

      const scheduledTime = new Date(instance.scheduledTime);
      const countdownStartTime = new Date(scheduledTime.getTime() - (template.countdownMinutes * 60 * 1000));
      const cooldownEndTime = new Date(scheduledTime.getTime() + (template.cooldownMinutes * 60 * 1000));

      if (currentTime >= countdownStartTime && currentTime <= cooldownEndTime) {
        let phase: 'countdown' | 'happening' | 'cooldown';
        
        if (currentTime < scheduledTime) {
          phase = 'countdown';
        } else if (currentTime.getTime() - scheduledTime.getTime() <= 60000) { // Within 1 minute of event
          phase = 'happening';
        } else {
          phase = 'cooldown';
        }

        activeInstances.push({ instance, template, phase });
      }
    }

    return activeInstances.sort((a, b) => 
      new Date(a.instance.scheduledTime).getTime() - new Date(b.instance.scheduledTime).getTime()
    );
  }

  // Get upcoming news instances (not yet in countdown phase)
  static getUpcomingNewsInstances(
    instances: NewsInstance[],
    templates: NewsTemplate[],
    currentTime: Date = new Date(),
    limit: number = 10
  ): Array<{ instance: NewsInstance; template: NewsTemplate }> {
    const upcomingInstances: Array<{ instance: NewsInstance; template: NewsTemplate }> = [];

    for (const instance of instances.filter(i => i.isActive)) {
      const template = templates.find(t => t.id === instance.templateId);
      if (!template) continue;

      const scheduledTime = new Date(instance.scheduledTime);
      const countdownStartTime = new Date(scheduledTime.getTime() - (template.countdownMinutes * 60 * 1000));

      // Event is upcoming if countdown hasn't started yet
      if (currentTime < countdownStartTime) {
        upcomingInstances.push({ instance, template });
      }
    }

    return upcomingInstances
      .sort((a, b) => 
        new Date(a.instance.scheduledTime).getTime() - new Date(b.instance.scheduledTime).getTime()
      )
      .slice(0, limit);
  }

  // Calculate time until news event starts (in seconds)
  static getTimeUntilNewsEvent(instance: NewsInstance, currentTime: Date = new Date()): number {
    const scheduledTime = new Date(instance.scheduledTime);
    return Math.floor((scheduledTime.getTime() - currentTime.getTime()) / 1000);
  }

  // Calculate time until news event countdown/cooldown ends (in seconds)
  static getTimeUntilNewsEventEnds(
    instance: NewsInstance, 
    template: NewsTemplate, 
    currentTime: Date = new Date()
  ): number {
    const scheduledTime = new Date(instance.scheduledTime);
    const cooldownEndTime = new Date(scheduledTime.getTime() + (template.cooldownMinutes * 60 * 1000));
    return Math.floor((cooldownEndTime.getTime() - currentTime.getTime()) / 1000);
  }

  // Validate news instance scheduling
  static validateNewsInstance(instance: NewsInstance): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const now = new Date();
    const scheduledTime = new Date(instance.scheduledTime);

    if (scheduledTime <= now) {
      errors.push('News event must be scheduled in the future');
    }

    if (!instance.name || instance.name.trim().length === 0) {
      errors.push('News event must have a name');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get news impact color/styling
  static getNewsImpactStyling(impact: NewsImpact): { color: string; bgColor: string; borderColor: string } {
    switch (impact) {
      case 'high':
        return {
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30'
        };
      case 'medium':
        return {
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30'
        };
      case 'low':
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30'
        };
    }
  }
}