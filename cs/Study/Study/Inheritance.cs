namespace Study
{
    public class Inheritance
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

        public static void Run()
        {
            var b = new B()
            {
                Id = 1,
            };

            Console.WriteLine(b.Id);

            A a = b;

            Console.WriteLine(a.Id);
        }
    }
}
