namespace Study
{
    public class A
    {
        public virtual int Id { get; set; }
    }

    public class B : A
    {
        public override int Id
        {
            get;
            set;
        }
    }

    internal class Program
    {
        private static void Main(string[] args)
        {
            var b = new B()
            {
                Id = 1,
            };

            Console.WriteLine(b.Id);

            A a = b;

            Console.WriteLine(a.Id);
            Console.ReadLine();
        }
    }
}
