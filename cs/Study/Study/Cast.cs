
namespace Study
{
    public class Cast
    {
        private class A
        {
            private readonly List<int> list = [1, 2, 3];

            public IEnumerable<int> List
            {
                get { return list; }
            }
        }

        public static void Run()
        {
            var a = new A();

            if (a.List is List<int> list)
            {
                list.Add(4);
            }

        }
    }
}
