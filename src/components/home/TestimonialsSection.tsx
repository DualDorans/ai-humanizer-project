import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Marketing Manager',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'TextHuman is a game-changer. My AI-written content now sounds perfectly natural and passes all AI detection tools. It\'s saved me countless hours of manual editing.',
    stars: 5,
  },
  {
    name: 'Michael Patel',
    role: 'Freelance Writer',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'As someone who uses AI for first drafts, TextHuman has been invaluable. It ensures my work retains a personal touch while speeding up my workflow significantly.',
    stars: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'PhD Student',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'I use TextHuman for my research summaries and it works flawlessly. The humanized text maintains academic integrity while making my writing more engaging.',
    stars: 4,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied users who trust TextHuman for their content needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.stars ? 'text-warning-400 fill-warning-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}