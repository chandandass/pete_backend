import { Post } from 'src/entities/post.entity';
import { StaticFamilyPrompt } from 'src/entities/static/static-family-prompt.entity';
import { StaticKidPrompt } from 'src/entities/static/static-kid-mvp-prompt.entity';
import { User } from 'src/entities/user.entity';

export class PromptGenerator {
  private static generateCelebrationMessage(
    celebrationName: string,
    i: number,
    eventYear: number,
  ): string {
    let greetings = '';

    if (i === 0) {
      greetings = ` Our first ${celebrationName}!`;
    } else {
      greetings = ` ${celebrationName} '${eventYear.toString().slice(-2)}`;
    }

    return greetings;
  }

  private static generateCelebrations(
    user: User,
    staticFamilyPrompt: StaticFamilyPrompt,
  ): Post[] {
    const celebrationName = staticFamilyPrompt.name;
    const celebrationDate = new Date(staticFamilyPrompt.date);
    const times = staticFamilyPrompt.repeat || 19;

    const celebrations: Post[] = [];

    let today = new Date(user.created_at);
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [month, day] = [
      celebrationDate.getMonth(),
      celebrationDate.getDate(),
    ];
    const startDate = new Date(today.getFullYear(), month, day);

    let currentYear = startDate.getFullYear();
    if (today > startDate) {
      currentYear++;
    }

    for (let i = 0; i < times; i++) {
      const eventYear = currentYear + i;
      const eventDate = new Date(eventYear, month, day);

      const greetings = PromptGenerator.generateCelebrationMessage(
        celebrationName,
        i,
        eventYear,
      );

      celebrations.push({
        show_order_date: eventDate,
        last_update: eventDate,
        title: greetings,
        user: user,
        prompt_type: 'FAMILY',
      } as Post);
    }

    return celebrations;
  }

  private static greetWithAge(name: string, age: number): string {
    const yearWord = age === 1 ? 'year' : 'years';
    return `${name}'s ${age} ${yearWord} old!`;
  }

  private static generateDateFromRTB(dob: Date, rtb: number): Date {
    const date = new Date(dob);
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    return new Date(date.getTime() + rtb * millisecondsInADay);
  }

  public static generateAgePrompts(user: User, years: number = 19): Post[] {
    const agePosts: Post[] = [];

    if (!user.children || user.children.length === 0) return agePosts;

    user.children.forEach((child) => {
      let dob = new Date(child.date_of_birth);
      const [year, month, day] = [
        dob.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
      ];

      for (let i = 1; i <= years; i++) {
        let date = new Date(year + i, month, day);
        agePosts.push({
          title: PromptGenerator.greetWithAge(child.name, i),
          show_order_date: date,
          last_update: date,
          input_type: 'IMAGE',
          prompt_type: 'FAMILY',
          child_id: child.id,
          user,
        } as Post);
      }
    });

    return agePosts;
  }

  public static generateFamilyPrompts(
    user: User,
    staticFamilyPrompts: StaticFamilyPrompt[],
  ): Post[] {
    const celebrations = staticFamilyPrompts.map((prompt) =>
      PromptGenerator.generateCelebrations(user, prompt),
    );
    const agePosts = PromptGenerator.generateAgePrompts(user);
    return [...celebrations.flat(), ...agePosts]; // Flatten the array of celebrations if necessary
  }

  public static generateKidPrompts(
    user: User,
    staticKidPrompts: StaticKidPrompt[],
  ): Post[] {
    if (!user.children || user.children.length === 0) {
      console.warn('No children found for the user');
      return [];
    }

    return user.children.flatMap((child) =>
      staticKidPrompts.map((prompt) => {
        const postDate = PromptGenerator.generateDateFromRTB(
          child.date_of_birth,
          prompt.relative_to_birth,
        );

        return {
          show_order_date: postDate,
          last_update: postDate,
          title: prompt.txt,
          input_type: prompt.type,
          prompt_type: 'KID',
          child_id: child.id,
          user,
        } as Post;
      }),
    );
  }
}
