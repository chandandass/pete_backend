import { Post } from "src/entities/post.entity";
import { StaticFamilyPrompt } from "src/entities/static/static-family-prompt.entity";
import { StaticKidPrompt } from "src/entities/static/static-kid-mvp-prompt.entity";
import { User } from "src/entities/user.entity";

interface Celebration {
    date: Date;
    greetings: string;
 }

class PromptGenerator {

    private generateCelebrations(celebrationDate: string, celebrationName: string, times: number = 19): Celebration[] {
        const celebrations: Celebration[] = [];
        
        let today = new Date('2024-12-26');
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const [month, day] = celebrationDate.split('-').map(num => parseInt(num, 10));
        const startDate = new Date(today.getFullYear(), month - 1, day);
        
        let currentYear = startDate.getFullYear();
        if (today > startDate) {
          currentYear++;
        }
        
        // Loop for the number of celebrations
        for (let i = 0; i < times; i++) {
          const eventYear = currentYear + i;
          const eventDate = new Date(eventYear, month - 1, day);
          
          // Construct the greeting message
          let greetings = `${eventDate.toLocaleDateString()} ${celebrationName}`;
          
          // For the first celebration
          if (i === 0) {
            greetings += ` Our first ${celebrationName}!`;
          } else {
            greetings += ` ${celebrationName} '${eventYear.toString().slice(-2)}`;
          }
          
          celebrations.push({ date: eventDate, greetings });
        }
        
        return celebrations;
    }
      
    private greetWithAge(name: string, age: number): string {
        const yearWord = age === 1 ? "year" : "years";
        return `${name}'s ${age} ${yearWord} old!`;
    }
    private genFamilyPrompt(user: User, staticFamilyPrompt: StaticFamilyPrompt) {
        user.created_at
    }
    private genKidPrompt(user: User, staticKidPrompts: StaticKidPrompt[]): Post[] {
        if (!user.children || user.children.length === 0) {
            throw new Error("No children found for the user");
        }
    
        return user.children.flatMap((child) =>
            staticKidPrompts.map((prompt) => {
                const postDate = this.genDateFromRTB(child.date_of_birth, prompt.relative_to_birth);
    
                return {
                    show_order_date: postDate,
                    last_update: postDate,
                    title: prompt.txt,
                    child_id: child.id,
                    input_type: prompt.type,
                    prompt_type: 'KID',
                } as Post;
            })
        );
    }
    
    genDateFromRTB(dob: Date, rtb: number): Date {
        const date = new Date(dob);
        const millisecondsInADay = 24 * 60 * 60 * 1000;
        const newDate = new Date(date.getTime() + rtb * millisecondsInADay)
        return newDate;
    }
    private genReflectionPrompt() {

    }
}